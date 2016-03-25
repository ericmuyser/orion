Basic Grid:

    <Grid>
        <Col span={4}>
            4
        </Col>
        <Col span={16}>
            16
        </Col>
        <Col span={4}>
            4
        </Col>
    </Grid>

Action Bar Grid:

    var props = {
        maxItems: 11,
        items: [
            {title: 'Attack', skillId: 43, slotId: 1},
            {title: 'Fireball', skillId: 74, slotId: 2},
            {title: 'Frozen Orb', skillId: 13, slotId: 4, isLeft: true},
            {title: 'Lightning Shield', skillId: 4, slotId: 9},
            {title: 'Static', skillId: 46, slotId: 7, isRight: true},
            {title: 'Health Potion', skillId: 86, slotId: 3}
        ]
    };

    <Grid>
        <Col span={4}>
            <Globe color="green" flip={true} />
        </Col>
        <Col span={16} style={{'margin-top': 'auto'}}>
            <ActionBar {...props} />
        </Col>
        <Col span={4}>
            <Globe color="green" />
        </Col>
    </Grid>