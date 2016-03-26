Basic action bar:

    <ActionBar />

Full action bar:

    var props = {
        maxItems: 12,
        items: [
            {title: 'Attack', skillId: 43, slotId: 1},
            {title: 'Fireball', skillId: 74, slotId: 2},
            {title: 'Frozen Orb', skillId: 13, slotId: 4, isLeft: true},
            {title: 'Lightning Shield', skillId: 4, slotId: 9},
            {title: 'Static', skillId: 46, slotId: 7, isRight: true},
            {title: 'Health Potion', skillId: 86, slotId: 3}
        ]
    };

    <ActionBar {...props} />