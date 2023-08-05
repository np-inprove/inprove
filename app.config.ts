export default defineAppConfig({
  forum: {
    // This list is ChatGPT generated
    reactions: [
      '🥞', '👍', '👎', '😂', '😮', '😢',
      '😡', '👏', '👌', '🎉', '🔥', '🚀',
      '👀', '💯', '🤔', '🙌', '💩', '👻',
      '💕', '👑', '🍻', '🚨', '👇', '👈',
      '👉', '👆', '🙏', '🤦', '🤷', '🤯',
      '🤬', '🤢', '🤮', '👋', '🤝', '👊',
      '✊', '🤘', '👏',
    ],
    redeemableReaction: '🥞', // Reaction which will give points,
  },

  points: {
    userMax: 5, // Maximum points a user can award in a day
  },
})
