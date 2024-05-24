import { Participant, registerPlugin } from '@pexip/plugin-api';

// Register the plugin with the specified ID and version
const plugin = await registerPlugin({
  id: 'videomute-plugin',
  version: 0,
});

// Constants for button labels and position
const BUTTON_POSITION = 'participantActions';
const MUTE_VIDEO_TEXT = 'Mute video';
const UNMUTE_VIDEO_TEXT = 'Unmute video';

// Add Mute and Unmute buttons to the participant actions UI
const btnMute = await plugin.ui.addButton({ position: BUTTON_POSITION, label: MUTE_VIDEO_TEXT });
const btnUnmute = await plugin.ui.addButton({ position: BUTTON_POSITION, label: UNMUTE_VIDEO_TEXT });

// Event listener for participant updates
plugin.events.participants.add(async ({ participants }) => {
  // Arrays to hold identities of muted and unmuted participants
  const mutedParticipants = [];
  const unmutedParticipants = [];

  // Iterate through participants and categorize them based on their camera mute status
  for (const participant of participants) {
    if (participant.isCameraMuted) {
      mutedParticipants.push(participant.identity);
    } else {
      unmutedParticipants.push(participant.identity);
    }
  }

  // Update the Unmute button to be visible for muted participants
  if (mutedParticipants.length > 0) {
    await btnUnmute.update({ position: BUTTON_POSITION, label: UNMUTE_VIDEO_TEXT, participantIDs: mutedParticipants });
  } else {
    // If no participants are muted, ensure the Unmute button is not visible
    await btnUnmute.update({ position: BUTTON_POSITION, label: UNMUTE_VIDEO_TEXT, participantIDs: [] });
  }

  // Update the Mute button to be visible for unmuted participants
  if (unmutedParticipants.length > 0) {
    await btnMute.update({ position: BUTTON_POSITION, label: MUTE_VIDEO_TEXT, participantIDs: unmutedParticipants });
  } else {
    // If no participants are unmuted, ensure the Mute button is not visible
    await btnMute.update({ position: BUTTON_POSITION, label: MUTE_VIDEO_TEXT, participantIDs: [] });
  }
});

// Button click action for muting video
btnMute.onClick.add(async ({ participantUuid }) => {
  await plugin.conference.muteVideo({ muteVideo: true, participantUuid });
});

// Button click action for unmuting video
btnUnmute.onClick.add(async ({ participantUuid }) => {
  await plugin.conference.muteVideo({ muteVideo: false, participantUuid });
});


