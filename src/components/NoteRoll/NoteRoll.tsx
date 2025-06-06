import React, { memo, useEffect } from 'react';
import { Group } from '@shopify/react-native-skia';
import {
  Easing,
  withDelay,
  withTiming,
  SharedValue,
  useSharedValue,
  useDerivedValue,
} from 'react-native-reanimated';

import { NoteName, Song } from '@/songs';
import { gameWidth, gameHeight, pianoKeyboardHeight } from '@/utils/utils';

import NoteRollBackground from './NoteRollBackground';
import NoteRollNotes from './NoteRollNotes';
import NoteRollLines from './NoteRollLines';

interface NoteRollProps {
  song: Song;
  keysState: Record<NoteName, boolean>;
  noteRollY: SharedValue<number>;
}

const T3TransformEnabled = true;

const NoteRoll: React.FC<NoteRollProps> = ({ song, keysState, noteRollY }) => {
  const perspectiveRollIn = useSharedValue(0);

  const noteRollTransform = useDerivedValue(() => [
    { translateY: noteRollY?.value },
  ]);

  const threeDRollTransform = useDerivedValue(() => {
    if (!T3TransformEnabled) {
      return [];
    }

    return [
      { translateX: gameWidth / 2 },
      { translateY: gameHeight - pianoKeyboardHeight },
      // Apply the perspective effect
      { perspective: perspectiveRollIn.value },
      { rotateX: Math.PI / 10 },
      // Go back to the top of the screen
      { translateX: -gameWidth / 2 },
      { translateY: -gameHeight + pianoKeyboardHeight },
    ];
  });

  useEffect(() => {
    perspectiveRollIn.value = 0;
    perspectiveRollIn.value = withDelay(
      250,
      withTiming(400, {
        duration: 750,
        easing: Easing.inOut(Easing.ease),
      })
    );

    return () => {
      perspectiveRollIn.value = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song.name]);

  return (
    <Group transform={threeDRollTransform}>
      <NoteRollBackground keysState={keysState} />
      <NoteRollLines keysState={keysState} />
      <Group transform={noteRollTransform}>
        <NoteRollNotes song={song} />
      </Group>
    </Group>
  );
};

export default memo(NoteRoll);
