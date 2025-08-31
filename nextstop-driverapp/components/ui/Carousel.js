import React, { useState, useRef, useCallback, createContext, useContext } from 'react';
import { View, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { Button } from './Button';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { colors, radius } from './Theme';

const CarouselContext = createContext(null);

export function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within a Carousel');
  }
  return context;
}

export function Carousel({ children, orientation = 'horizontal', style }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const scrollViewRef = useRef(null);
  const { width: screenWidth } = Dimensions.get('window');

  const scrollNext = useCallback(() => {
    if (currentIndex < itemCount - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * screenWidth,
        animated: true,
      });
    }
  }, [currentIndex, itemCount, screenWidth]);

  const scrollPrev = useCallback(() => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      scrollViewRef.current?.scrollTo({
        x: prevIndex * screenWidth,
        animated: true,
      });
    }
  }, [currentIndex, screenWidth]);

  const canScrollPrev = currentIndex > 0;
  const canScrollNext = currentIndex < itemCount - 1;

  const contextValue = {
    scrollNext,
    scrollPrev,
    canScrollPrev,
    canScrollNext,
    currentIndex,
    setCurrentIndex,
    itemCount,
    setItemCount,
    scrollViewRef,
    screenWidth,
    orientation,
  };

  return (
    <CarouselContext.Provider value={contextValue}>
      <View style={[styles.carousel, style]}>
        {children}
      </View>
    </CarouselContext.Provider>
  );
}

export function CarouselContent({ children, style }) {
  const { scrollViewRef, screenWidth, setItemCount, setCurrentIndex } = useCarousel();
  
  const childrenArray = React.Children.toArray(children);
  
  React.useEffect(() => {
    setItemCount(childrenArray.length);
  }, [childrenArray.length, setItemCount]);

  const handleMomentumScrollEnd = (event) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentIndex(newIndex);
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={handleMomentumScrollEnd}
      style={[styles.content, style]}
    >
      {children}
    </ScrollView>
  );
}

export function CarouselItem({ children, style }) {
  const { screenWidth } = useCarousel();
  
  return (
    <View style={[styles.item, { width: screenWidth }, style]}>
      {children}
    </View>
  );
}

export function CarouselPrevious({ style, ...props }) {
  const { scrollPrev, canScrollPrev } = useCarousel();
  
  return (
    <Button
      variant="outline"
      size="icon"
      onPress={scrollPrev}
      disabled={!canScrollPrev}
      style={[styles.prevButton, style]}
      {...props}
    >
      <ArrowLeft size={16} color={colors.foreground} />
    </Button>
  );
}

export function CarouselNext({ style, ...props }) {
  const { scrollNext, canScrollNext } = useCarousel();
  
  return (
    <Button
      variant="outline"
      size="icon"
      onPress={scrollNext}
      disabled={!canScrollNext}
      style={[styles.nextButton, style]}
      {...props}
    >
      <ArrowRight size={16} color={colors.foreground} />
    </Button>
  );
}

const styles = StyleSheet.create({
  carousel: {
    position: 'relative',
  },
  content: {
    overflow: 'hidden',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevButton: {
    position: 'absolute',
    left: 8,
    top: '50%',
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    zIndex: 1,
  },
  nextButton: {
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    zIndex: 1,
  },
});
