import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';

const FloatingChatbot = () => {
  const navigate = useNavigate();
  const { user, isClient, isPM, isDeveloper } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: "👋 Hi! I'm your DevQuest guide. Ask me about navigating the platform, creating projects, managing tasks, or earning XP!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickActions = [
    { label: "📊 View Dashboard", path: "/dashboard", keywords: ["dashboard", "stats", "overview", "summary"] },
    { label: "🎯 Browse Projects", path: "/dashboard", keywords: ["projects", "browse", "find project"] },
    { label: "👤 My Profile", path: "/profile", keywords: ["profile", "account", "settings", "edit profile"] },
    { label: "🏆 Leaderboard", path: "/leaderboard", keywords: ["leaderboard", "ranking", "top users", "leaders"] },
  ];

  const helpTopics = {
    xp: {
      keywords: ["xp", "experience", "points", "earn", "level", "how many xp", "xp do i get"],
      response: "💎 **Complete XP Guide:**\n\n🎯 **Quest Givers (Clients):**\n• +50 XP for creating each project\n• +10% bonus XP when tasks complete\n\n⚔️ **Guild Masters (PMs):**\n• +10 XP for creating each task\n• +20% bonus XP when devs complete tasks\n\n🗡️ **Adventurers (Developers):**\n• Easy tasks: 25 XP\n• Medium tasks: 50 XP\n• Hard tasks: 100 XP\n• Expert tasks: 200+ XP\n\n📈 **Leveling:** Every 100 XP = 1 level up!\nLevel 1→2 at 100 XP, Level 2→3 at 200 XP, etc."
    },
    projects: {
      keywords: ["project", "create project", "new project", "start project"],
      response: isClient 
        ? "🎯 **Create a Project:**\n1. Go to Dashboard\n2. Click 'Create New Quest'\n3. Fill in details (title, description, budget, deadline)\n4. Submit to earn 50 XP!\n\nWould you like me to take you there?"
        : "🎯 **Projects:**\nOnly Quest Givers (Clients) can create projects. You can join projects as a team member!\n\nCheck your Dashboard to see assigned projects."
    },
    tasks: {
      keywords: ["task", "create task", "assign task", "complete task"],
      response: isPM
        ? "📝 **Managing Tasks:**\n1. Open a project\n2. Click 'Create Task' on the Quest Board\n3. Set title, description, XP reward, difficulty\n4. Assign to a developer\n\nEarn 10 XP + 20% bonus when completed!"
        : isDeveloper
        ? "📝 **Completing Tasks:**\n1. View assigned tasks on the Quest Board\n2. Drag tasks: To Do → In Progress → Done\n3. Earn the full task XP when you complete it!\n\nHigher difficulty = More XP! 🚀"
        : "📝 **Tasks:**\nOnly Guild Masters (PMs) can create tasks. Developers complete them on the Quest Board using drag & drop!"
    },
    badges: {
      keywords: ["badge", "achievement", "reward", "unlock"],
      response: "🎖️ **Badges & Achievements:**\nEarn badges by completing tasks:\n• First Quest (1 task)\n• Task Slayer (10 tasks)\n• Bug Hunter (find bugs)\n• Speed Demon (quick completion)\n\nCheck your profile to see all badges! Want to go there?"
    },
    chat: {
      keywords: ["chat", "message", "team chat", "communication"],
      response: "💬 **Team Chat:**\nEach project has a real-time chat room!\n\n1. Open any project\n2. Scroll to 'Team Chat' section\n3. Chat with your team instantly\n\nAll project members (client, PM, developers) can chat together!"
    },
    roles: {
      keywords: ["role", "client", "pm", "developer", "guild master", "quest giver"],
      response: "👥 **Roles in DevQuest:**\n🎯 Quest Giver (Client) - Creates projects\n⚔️ Guild Master (PM) - Manages projects & creates tasks\n🗡️ Adventurer (Developer) - Completes tasks\n\nYou're currently a **" + (isClient ? "Quest Giver" : isPM ? "Guild Master" : "Adventurer") + "**!"
    }
  };

  const findBestMatch = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Check for navigation keywords
    for (const action of quickActions) {
      if (action.keywords.some(keyword => input.includes(keyword))) {
        return {
          type: 'navigation',
          action: action,
          response: `I can take you to ${action.label}. Click below to navigate!`
        };
      }
    }

    // Check for help topics
    for (const [key, topic] of Object.entries(helpTopics)) {
      if (topic.keywords.some(keyword => input.includes(keyword))) {
        return {
          type: 'help',
          response: topic.response
        };
      }
    }

    // Default response with suggestions
    return {
      type: 'default',
      response: "I can help you with:\n• Creating projects & tasks\n• Earning XP & leveling up\n• Understanding roles & badges\n• Navigating the platform\n• Using team chat\n\nWhat would you like to know?"
    };
  };

  const handleSend = async (messageText = input) => {
    if (!messageText.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const roleInfo = isClient ? "Client" : isPM ? "PM" : "Developer";
      
      // Call backend chatbot endpoint
      const response = await api.post('/chatbot/message', {
        message: messageText,
        role: roleInfo
      });

      const botResponse = response.data.data.response;

      // Check if response suggests navigation
      const navigationMatch = checkForNavigation(botResponse);
      
      const botMessage = {
        role: 'bot',
        content: botResponse,
        action: navigationMatch
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.log('AI temporarily unavailable, using smart fallback responses');
      
      // Fallback to rule-based response when AI fails
      const match = findBestMatch(messageText);
      const botMessage = {
        role: 'bot',
        content: match.response,
        action: match.type === 'navigation' ? match.action : null
      };
      setMessages(prev => [...prev, botMessage]);
    }

    setIsLoading(false);
  };

  const checkForNavigation = (responseText) => {
    const lowerResponse = responseText.toLowerCase();
    
    if (lowerResponse.includes('dashboard') || lowerResponse.includes('stats')) {
      return { label: "📊 View Dashboard", path: "/dashboard" };
    }
    if (lowerResponse.includes('profile') || lowerResponse.includes('account')) {
      return { label: "👤 My Profile", path: "/profile" };
    }
    if (lowerResponse.includes('leaderboard') || lowerResponse.includes('ranking')) {
      return { label: "🏆 Leaderboard", path: "/leaderboard" };
    }
    return null;
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const suggestedQuestions = [
    "How do I earn XP?",
    "How to create a project?",
    "What are badges?",
    "Show me the leaderboard"
  ];

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-110 group"
          aria-label="Open Guide"
        >
          <div className="relative">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              ?
            </span>
          </div>
          <span className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
            Need help?
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h3 className="font-bold text-white">DevQuest Guide</h3>
                <p className="text-xs text-white/80">Here to help!</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div key={index}>
                <div
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-br-sm'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
                
                {/* Navigation button if action exists */}
                {message.action && (
                  <div className="flex justify-start mt-2">
                    <button
                      onClick={() => handleNavigate(message.action.path)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      Go to {message.action.label}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 bg-gray-50">
              <p className="text-xs text-gray-500 mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.slice(0, 2).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(question)}
                    className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 bg-gray-50 border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="bg-linear-to-r from-purple-600 to-indigo-600 text-white px-5 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;
