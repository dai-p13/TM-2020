var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var player;
var score = 0;
var scoreText;

function preload () {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude',
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

function create () {

    //Plataformas
    this.add.image(400, 300, 'sky');
    platforms = this.physics.add.staticGroup();                     //Cria um monte de plataformas
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    //Player
    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    this.anims.create({                                 //Atribui as animaçoes às teclas
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }), //
        frameRate: 10,
        repeat: -1
    });
    player.body.setGravityY(300)
    this.physics.add.collider(player, platforms);               //Permite que o player nao passe abaixo da plataforma

    cursors = this.input.keyboard.createCursorKeys(); //Utilização do Teclado

    //Criar Objetvos (coletáveis)
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }           //Usado para setar a posição
    });
    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    function collectStar (player, star)  //Função para "apanhar" as estrelas
    {
        star.disableBody(true, true);

        score += 10;
        scoreText.setText('Score: ' + score);

        if (stars.countActive(true) === 0)              //Solta a bomba (impedir o player de apanhar as estrelas so sai quando apanhar a 1º)
        {
            stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });
            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) :
                Phaser.Math.Between(0, 400);
            var bomb = bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }

    //Score
    scoreText = this.add.text(16, 16, 'score: 0', {         //Mostra um placar de score
        fontSize: '32px', fill: '#000' });

    //Enemies
    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);

    function hitBomb (player, bomb)     //Se o player tocar na bomba -> gameover
    {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        gameOver = true;
    }
}

function update () {
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);
        player.anims.play('left', true); //Se a tecla para a esquerda estiver a ser carregada a animacao e chamada e o player move-se
                                        // a velocidade 160
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);
        player.anims.play('right', true);   //Se a tecla para a direita estiver a ser carregada a animacao e chamada e o player move-se
                                            // a velocidade 160
    }
    else
    {
        player.setVelocityX(0);     //Se nao se carregar o plaayer nao se move e a animaçao e chamada
        player.anims.play('turn');
    }
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-500);        //Se a tecla para a cima estiver e o player nao estiver no ar a ser carregada a animacao
                                            // e chamada e o player move-se a velocidade 160
    }
}