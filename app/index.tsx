import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [currentToss, setCurrentToss] = useState<'heads' | 'tails' | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [videoSource, setVideoSource] = useState<any>(null);
  const [key, setKey] = useState(0);

  const player = useVideoPlayer(videoSource, player => {
    if (player) {
      player.loop = false;
      player.play();
    }
  });

  useEffect(() => {
    if (!player) return;
    
    const subscription = player.addListener('statusChange', (status) => {
      if (status.status === 'idle' && status.oldStatus === 'readyToPlay') {
        setShowResult(true);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

  const handleToss = () => {
    const randomResult = Math.random() < 0.4 ? 'heads' : 'tails';
    setCurrentToss(randomResult);
    setShowResult(false);
    setKey(prev => prev + 1);
    
    const newSource = randomResult === 'heads' 
      ? require('@/assets/heads.mp4') 
      : require('@/assets/tails.mp4');
    
    setVideoSource(newSource);
    
    // Force player to replay
    if (player) {
      player.replace(newSource);
      player.play();
    }

    // Show result after 1.5 seconds (adjust this time as needed)
    setTimeout(() => {
      setShowResult(true);
    }, 1800);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>Coin Toss</ThemedText>
        
        {currentToss ? (
          <>
            <View style={styles.videoContainer}>
              <VideoView
                key={key}
                player={player}
                style={styles.video}
                contentFit="contain"
                nativeControls={false}
              />
            </View>
            
            {showResult && (
              <ThemedText type="subtitle" style={styles.resultText}>
                {currentToss === 'heads' ? 'Heads!' : 'Tails!'}
              </ThemedText>
            )}
          </>
        ) : (
          <>
            <View style={styles.videoContainer}>
              <Image
                source={require('@/assets/default.png')}
                style={styles.defaultImage}
                resizeMode="contain"
              />
            </View>
            <ThemedText style={styles.instruction}>
              Tap the button below to toss the coin
            </ThemedText>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleToss}>
        <ThemedText style={styles.buttonText}>TOSS</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginBottom: 40,
  },
  videoContainer: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  defaultImage: {
    width: '100%',
    height: '100%',
  },
  resultText: {
    fontSize: 32,
    marginTop: 20,
  },
  instruction: {
    textAlign: 'center',
    opacity: 0.7,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 60,
    paddingVertical: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
