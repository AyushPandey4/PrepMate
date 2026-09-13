import { useState, useEffect, useCallback, useRef } from 'react';

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState([]);
  const selectedVoiceRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);

      const updateVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);

        // Pick a natural English voice if available
        const preferredVoice =
          availableVoices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha'))) ||
          availableVoices.find(v => v.lang.startsWith('en')) ||
          availableVoices[0];

        selectedVoiceRef.current = preferredVoice || null;
      };

      updateVoices();

      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
    }

    // Cleanup: stop speaking if component unmounts
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((text, onEnd) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) {
      return;
    }

    // Cancel any previous utterance
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[*_#`]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    if (selectedVoiceRef.current) {
      utterance.voice = selectedVoiceRef.current;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      // 'interrupted' and 'canceled' are standard browser events triggered when speech is stopped or replaced
      if (e.error === 'interrupted' || e.error === 'canceled') {
        setIsSpeaking(false);
        return;
      }
      console.warn('Speech synthesis error:', e);
      setIsSpeaking(false);
    };

    // Small delay ensures previous cancel() resolves cleanly in browser speech queue
    setTimeout(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.speak(utterance);
      }
    }, 10);
  }, []);

  const cancel = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    speak,
    cancel,
    isSpeaking,
    isSupported,
    voices,
  };
}
