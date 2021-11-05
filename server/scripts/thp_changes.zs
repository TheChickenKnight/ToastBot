/*							===	thp_changes ===							*/						

#priority 10
// Imports
import loottweaker.LootTweaker;
import loottweaker.vanilla.loot.LootTable;
import loottweaker.vanilla.loot.LootPool;
import crafttweaker.oredict.IOreDict;
import crafttweaker.oredict.IOreDictEntry;

// Many recipes are removed through UniDict.cfg

// Vanilla Bookshelf compact with Chisel/Quark
<minecraft:bookshelf>.displayName = "Oak Bookshelf";
recipes.remove(<minecraft:bookshelf>);
recipes.addShaped(<minecraft:bookshelf>,
										[[<minecraft:oak_stairs>, null, <minecraft:oak_stairs>],
										[<minecraft:book>, <minecraft:book>, <minecraft:book>],
										[<minecraft:oak_stairs>, null, <minecraft:oak_stairs>]]);

// Improve drops from cows
val cowTable = LootTweaker.getTable("minecraft:entities/cow");
val cowPool = cowTable.getPool("main");
cowPool.setRolls(2, 2);

// Modify Bound Leather recipe
recipes.remove(<backpack:bound_leather>);
recipes.addShaped(<backpack:bound_leather>,
											[[null, <minecraft:string>, null],
											[<minecraft:leather>, <minecraft:string>, <minecraft:leather>],
											[null, <minecraft:string>, null]]);
											
// Modify Mega Torch recipe
recipes.remove(<torchmaster:mega_torch>);
recipes.addShaped(<torchmaster:mega_torch>,
											[[<minecraft:torch>, <minecraft:torch>, <minecraft:torch>],
											[<minecraft:diamond_block>, oreDict.logWood, <minecraft:diamond_block>],
											[<minecraft:gold_block>, oreDict.logWood, <minecraft:gold_block>]]);

// Add JEI item descriptions
mods.jei.JEI.addDescription(<cqrepoured:scale_turtle>, "Can be used for repairing, and trading in some Taverns");
mods.jei.JEI.addDescription(<cqrepoured:leather_bull>, "Can be used for repairing, and trading in some Taverns");
mods.jei.JEI.addDescription(<cqrepoured:ball_slime>, "Can be used for repairing, and trading in some Taverns");
mods.jei.JEI.addDescription(<cqrepoured:leather_spider>, "Can be used for repairing, and trading in some Taverns");
mods.jei.JEI.addDescription(<cqrepoured:king_crown>, "Can be attached to helmets");

// Rename Builder's Wands
<betterbuilderswands:wandstone>.displayName = "Stone Builder's Wand";
<betterbuilderswands:wandiron>.displayName = "Iron Builder's Wand";
<betterbuilderswands:wanddiamond>.displayName = "Diamond Builder's Wand";

// Fix broken names
<pvj:juniper_pressure_plate>.displayName = "Juniper Pressure Plate";
<pvj:cherry_blossom_pressure_plate>.displayName = "Cherry Blossom Pressure Plate";
<pvj:jacaranda_pressure_plate>.displayName = "Jacaranda Pressure Plate";
<pvj:ice_formation>.displayName = "Ice Formation";
<growthcraft_cellar:cork_sapling>.displayName = "Cork Sapling";

// For new players
recipes.addShapeless(<hexxitgear:hexical_essence>, [<hexxitgear:hexbiscus>]);

// Add Cyclops Eye info
mods.jei.JEI.addDescription(<cyclopstek:cyclops_eye>, "The cyclops lives on a small, remote island in the middle of the ocean");

// Modify Cloud Boots recipe
recipes.remove(<cqrepoured:boots_cloud>);
recipes.addShaped(<cqrepoured:boots_cloud>,
											[[null, null, null],
											[<cqrepoured:feather_golden>, null, <cqrepoured:feather_golden>],
											[<hexxitgear:hexical_diamond>, null, <hexxitgear:hexical_diamond>]]);
											
// Lower arrow drops
val mobsPassiveTable = LootTweaker.getTable("hexxitworld:field_drops/mobs_passive");
val mobsHostileTable = LootTweaker.getTable("hexxitworld:field_drops/mobs_hostile");
val mobsPassivePool = mobsPassiveTable.getPool("main");
val mobsHostilePool = mobsHostileTable.getPool("main");
mobsPassivePool.removeEntry("minecraft:arrow");
mobsHostilePool.removeEntry("arrow_5");

// Add Heart info
mods.jei.JEI.addDescription(<hexxitworld:permabuff>, "Possible drop from boss mobs");
mods.jei.JEI.addDescription(<hexxitworld:material:2>, "Rarely drops from high health mobs");

// Add Lunar Water info
mods.jei.JEI.addDescription(<nyx:lunar_water_bottle>, "If you fill a cauldron with water and let it sit exposed to the night sky for a certain time, it will eventually bubble with white particles. Throw in a Lapis Lazuli and see what happens...");

// Rebalance Diamond Giant Sword recipe
recipes.remove(<asr:diamond_giant_sword>);
recipes.addShaped(<asr:diamond_giant_sword>,
											[[null, <minecraft:diamond>, <minecraft:diamond>],
											[<minecraft:diamond>, <minecraft:diamond_block>, <minecraft:diamond>],
											[<minecraft:stick>, <minecraft:diamond>, null]]);