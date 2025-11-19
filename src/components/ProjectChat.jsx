import { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import chatService from '../services/chatService';
import LoadingSpinner from './LoadingSpinner';

const ProjectChat = ({ projectId, currentUser }) => {
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get Stream Chat token and API key
        const { token, apiKey, userId } = await chatService.getChatToken();

        // Initialize Stream Chat client
        const client = StreamChat.getInstance(apiKey);

        // Connect user - ensure userId is a string
        await client.connectUser(
          {
            id: String(userId || currentUser._id),
            name: currentUser.name,
            image: currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=random`,
          },
          token
        );

        setChatClient(client);

        // Create/get project channel
        const { channelId } = await chatService.createProjectChannel(projectId);

        // Get channel instance
        const projectChannel = client.channel('team', channelId);
        await projectChannel.watch();

        setChannel(projectChannel);
      } catch (err) {
        console.error('Failed to initialize chat:', err);
        setError(err.response?.data?.message || 'Failed to load chat');
      } finally {
        setLoading(false);
      }
    };

    if (projectId && currentUser) {
      initChat();
    }

    // Cleanup on unmount
    return () => {
      if (chatClient) {
        chatClient.disconnectUser();
      }
    };
  }, [projectId, currentUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-2">⚠️ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:underline text-sm"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }

  if (!chatClient || !channel) {
    return null;
  }

  return (
    <div className="h-[600px] border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <Chat client={chatClient} theme="messaging light">
        <Channel channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ProjectChat;
