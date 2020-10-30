const players = [
    {
      name: 'Lionel Messi',
      role: 'Attacker',
    },
    {
      name: 'Gianluigi Buffon',
      role: 'Goalkeeper',
    },
  ];


const playerResolver = {
    Query: {
      players: () => players,
    },
};

module.exports = playerResolver