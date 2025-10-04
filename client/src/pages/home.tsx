import { useState } from "react";
import StatusBar from "@/components/status-bar";
import EmergencyButton from "@/components/emergency-button";
import QuickActions from "@/components/quick-actions";
import ExcuseDisplay from "@/components/excuse-display";
import ToneSettings from "@/components/tone-settings";
import RecentExcuses from "@/components/recent-excuses";
import FakeCallModal from "@/components/fake-call-modal";
import FakeVideoCall from "@/components/fake-video-call";
import { useTheme } from "@/components/theme-provider";
import { useStealthMode } from "@/components/stealth-mode-provider";
import TabBar from "@/components/tab-bar";
import { useQuickTriggers } from "@/hooks/use-quick-triggers";

export interface GeneratedExcuse {
  id: string;
  content: string;
  category: string;
  tone: string;
  believability?: number;
  createdAt?: Date;
}

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { isStealth, toggleStealth, getMaskedLabel } = useStealthMode();
  const [currentExcuse, setCurrentExcuse] = useState<GeneratedExcuse | null>(null);
  const [selectedTone, setSelectedTone] = useState<"friendly" | "urgent" | "subtle">("friendly");
  const [currentPage, setCurrentPage] = useState("home");
  const [showFakeCall, setShowFakeCall] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [fakeContact, setFakeContact] = useState({
    name: "Sarah Johnson",
    relationship: "Sister"
  });

  // Quick gestures: triple tap or shake triggers emergency audio
  useQuickTriggers({
    onTriggerAudio: () => {
      // Simulate click of Emergency Call button via component callbacks
      if (currentExcuse) {
        setShowFakeCall(true);
      }
      // Else leave to EmergencyButton to generate and then open
      // We could dispatch a custom event for EmergencyButton to listen
      const evt = new CustomEvent("exitscript:triggerEmergency", { detail: { type: "audio" } });
      window.dispatchEvent(evt);
    },
  });

  const handleExcuseGenerated = (excuse: GeneratedExcuse) => {
    setCurrentExcuse(excuse);
  };

  const handleEmergencyCall = (excuse: GeneratedExcuse, contact: { name: string; relationship: string }) => {
    setCurrentExcuse(excuse);
    setFakeContact(contact);
    setShowFakeCall(true);
  };

  const handleEmergencyVideo = (excuse: GeneratedExcuse, contact: { name: string; relationship: string }) => {
    setCurrentExcuse(excuse);
    setFakeContact(contact);
    setShowVideoCall(true);
  };

  return (
    <div className="max-w-sm mx-auto bg-white dark:bg-gray-900 min-h-screen relative overflow-hidden">
      <StatusBar />
      
      <header className="bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-ios-dark dark:text-white">{getMaskedLabel("ExitScript", "Notes")}</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleStealth}
              className={`w-8 h-8 rounded-full ${isStealth ? 'bg-ios-blue text-white' : 'bg-gray-100 dark:bg-gray-800'} flex items-center justify-center ios-active`}
              title={isStealth ? 'Disable Stealth' : 'Enable Stealth'}
            >
              <i className={`fas ${isStealth ? 'fa-user-secret' : 'fa-user-secret text-gray-600'}`}></i>
            </button>
            <button 
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center ios-active"
            >
              <i className={`fas ${theme === 'dark' ? 'fa-sun text-yellow-400' : 'fa-moon text-gray-600'}`}></i>
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{getMaskedLabel('Quick excuses for any situation', 'Fast notes for any moment')}</p>
      </header>

      <main className="px-6 py-6 pb-24 bg-white dark:bg-gray-900">
        <EmergencyButton 
          onEmergencyCall={handleEmergencyCall}
          onEmergencyVideo={handleEmergencyVideo}
          selectedTone={selectedTone}
        />
        
        <QuickActions 
          onExcuseGenerated={handleExcuseGenerated}
          selectedTone={selectedTone}
        />
        
        {currentExcuse && (
          <ExcuseDisplay 
            excuse={currentExcuse}
            onTriggerFakeCall={() => {
              setShowFakeCall(true);
            }}
            onTriggerVideoCall={() => {
              setShowVideoCall(true);
            }}
          />
        )}
        
        <ToneSettings 
          selectedTone={selectedTone}
          onToneChange={setSelectedTone}
        />
        
        <RecentExcuses 
          onExcuseSelected={handleExcuseGenerated}
        />
      </main>
      
      <FakeCallModal
        isOpen={showFakeCall}
        onClose={() => setShowFakeCall(false)}
        contact={fakeContact}
      />

      <FakeVideoCall
        isOpen={showVideoCall}
        onClose={() => setShowVideoCall(false)}
        contact={fakeContact}
      />

      <TabBar active="home" />
    </div>
  );
}
