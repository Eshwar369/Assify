import React, { createContext, useContext, useState, useRef } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

interface TabBarContextType {
  isTabBarVisible: boolean;
  setTabBarVisible: (visible: boolean) => void;
  handleScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const TabBarContext = createContext<TabBarContextType>({
  isTabBarVisible: true,
  setTabBarVisible: () => {},
  handleScroll: () => {},
});

export const TabBarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTabBarVisible, setTabBarVisible] = useState(true);
  const lastScrollY = useRef(0);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = e.nativeEvent.contentOffset.y;
    const diff = currentY - lastScrollY.current;

    // Scrolling down past threshold -> hide
    if (diff > 12 && currentY > 60) {
      if (isTabBarVisible) {
        setTabBarVisible(false);
      }
    } else if (diff < -8 || currentY <= 30) {
      // Scrolling up or near top -> show
      if (!isTabBarVisible) {
        setTabBarVisible(true);
      }
    }

    lastScrollY.current = currentY;
  };

  return (
    <TabBarContext.Provider value={{ isTabBarVisible, setTabBarVisible, handleScroll }}>
      {children}
    </TabBarContext.Provider>
  );
};

export const useTabBar = () => useContext(TabBarContext);
