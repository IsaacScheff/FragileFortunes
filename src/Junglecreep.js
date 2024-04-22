export default class JungleCreep extends Phaser.Physics.Matter.Sprite {

    constructor(data) {
        let { scene, x, y, texture,} = data;
        super(scene.matter.world, x, y, texture);
        this.scene.add.existing(this);
        this.moveSpeed = 2;

        this.maxHealth = 100;
        this.currentHealth = this.maxHealth;
        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();

        this.isHidden = false;
    }
    static preload(scene) {
        scene.load.image('thermalBeetle', 'assets/images/ThermalBeetle.png');
    }
    update(time, delta) {
        if (!this.active) return;  // Skip updating if not active

        this.updateHealthBar();

        let tile = this.scene.map.getTileAtWorldXY(this.x, this.y, true, this.scene.cameras.main, 'Tile Layer 3');
        if (tile && tile.index !== -1) {  // Check if there is a tile and it is not an empty tile
            this.hide(true);
        } else {
            this.hide(false);
        }
    }
    takeDamage(amount) { 
        if (!this.active) return;  // Skip if already destroyed
        this.currentHealth -= amount;
        if (this.currentHealth <= 0) {
            this.die();
        }
    }
    updateHealthBar() {
        if (!this.active) return;  // Skip updating the health bar if not active

        this.healthBar.clear();
        this.healthBar.setPosition(this.x - 30, this.y - 40);

        this.healthBar.fillStyle(0x808080, 1);
        this.healthBar.fillRect(0, 0, 60, 10);

        this.healthBar.fillStyle(0xff0000, 1);
        this.healthBar.fillRect(0, 0, 60 * (this.currentHealth / this.maxHealth), 10);
    }
    die() {
        console.log("Creep died");
        let index = this.scene.creeps.indexOf(this);
        if (index !== -1) {
            this.scene.creeps.splice(index, 1);  // Remove from array
        }
        this.healthBar.destroy();
        this.destroy();  // Phaser's method to remove the sprite
    }
    hide(hideStatus) { //TODO: after jam; more intricate hide mechanic for characters in seperate bushes than the enemies
        if (hideStatus) {
            this.isHidden = true;
            this.setAlpha(0.5);  // Set opacity to 50%
        } else {
            this.isHidden = false;
            this.setAlpha(1.0);  // Set opacity to 100%
        }
    }
    
}