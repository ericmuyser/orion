Blank bottom menu:

    <BottomMenu></BottomMenu>

Full bottom menu:

    var props = {
        currentHealth: 500,
        maxHealth: 1000,
        currentMana: 500,
        maxMana: 750,
        currentExperience: 2000,
        maxExperience: 5000,
        menuItems: [
            {title: 'Character', menuId: 3},
            {title: 'Inventory', menuId: 43},
            {title: 'Skills', menuId: 3},
            {title: 'Party', menuId: 13},
            {title: 'Settings', menuId: 93}
        ],
        actionItems: [
            {title: 'Attack', skillId: 43, slotId: 1},
            {title: 'Fireball', skillId: 74, slotId: 2},
            {title: 'Frozen Orb', skillId: 13, slotId: 4, isLeft: true},
            {title: 'Lightning Shield', skillId: 4, slotId: 9},
            {title: 'Static', skillId: 46, slotId: 7, isRight: true},
            {title: 'Health Potion', skillId: 86, slotId: 3}
        ]
    };

    <BottomMenu {...props}></BottomMenu>