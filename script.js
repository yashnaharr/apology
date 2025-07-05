const SECRET_WORD = "SMART"; // Your custom 5-letter word
const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

let currentGuess = 0;
let gameEnded = false;

// Comprehensive list of 5-letter words for validation.
// This list is derived from common Wordle dictionary sources.
const VALID_WORDS = new Set([
    "ABACK", "ABASH", "ABATE", "ABBOT", "ABHOR", "ABIDE", "ABLED", "ABODE", "ABORT", "ABOUT",
    "ABOVE", "ABUSE", "ABYSS", "ACORN", "ACRID", "ACTOR", "ACUTE", "ADAGE", "ADAPT", "ADEPT",
    "ADMIN", "ADMIT", "ADOBE", "ADOPT", "ADORE", "ADORN", "ADULT", "AERIE", "AFTER", "AGAIN",
    "AGAPE", "AGATE", "AGENT", "AGILE", "AGING", "AGLOW", "AGONY", "AGORA", "AGREE", "AHEAD",
    "AHOY", "AIDES", "AISLE", "ALARM", "ALBUM", "ALERT", "ALGAE", "ALIAS", "ALIEN", "ALIGN",
    "ALIKE", "ALINE", "ALLAY", "ALLEY", "ALLOT", "ALLOW", "ALLOY", "ALOFT", "ALONE", "ALONG",
    "ALOUD", "ALPHA", "ALTAR", "ALTER", "AMASS", "AMBER", "AMBLE", "AMEND", "AMISS", "AMITY",
    "AMONG", "AMPLE", "AMPLY", "AMUSE", "ANGEL", "ANGER", "ANGLE", "ANGRY", "ANIMA", "ANION",
    "ANKLE", "ANNEX", "ANNOY", "ANNUL", "ANODE", "ANTON", "ANVIL", "APART", "APHID", "APNEA",
    "APPLE", "APPLY", "APRON", "AQUAE", "ARBOR", "ARDOR", "ARENA", "ARGUE", "ARISE", "ARMED",
    "AROMA", "AROSE", "ARRAY", "ARROW", "ARSON", "ARTIC", "ASCOT", "ASHEN", "ASHES", "ASIDE",
    "ASKEW", "ASPIN", "ASSAY", "ASSET", "ATLAS", "ATONE", "ATTIC", "AUDIO", "AUDIT", "AVAIL",
    "AVERT", "AWAIT", "AWAKE", "AWARD", "AWARE", "AWASH", "AWFUL", "AWHILE", "AXIAL", "AXIOM",
    "AZURE", "BABEL", "BABES", "BACLI", "BADGE", "BADLY", "BAGEL", "BAKER", "BALDY", "BALED",
    "BALES", "BALLS", "BALMY", "BAMBO", "BANDY", "BANJO", "BANKS", "BARBS", "BARGE", "BARKS",
    "BARNY", "BARON", "BASAL", "BASIC", "BASIN", "BASIS", "BATCH", "BATHS", "BATTY", "BAYOU",
    "BEACH", "BEADS", "BEAMY", "BEANS", "BEARD", "BEAST", "BEATS", "BEAUS", "BEAUT", "BECKS",
    "BEGIN", "BEGUN", "BEIGE", "BEING", "BELAY", "BELCH", "BELIE", "BELLY", "BELOW", "BEMIX",
    "BENCH", "BENDS", "BENEF", "BENIN", "BERRY", "BERTH", "BESET", "BETEL", "BEVEL", "BEZEL",
    "BHANG", "BIAS", "BIBLE", "BICEP", "BIDDY", "BIGOT", "BILEF", "BILGE", "BILLS", "BINGO",
    "BIRCH", "BIRDS", "BIRTH", "BISCU", "BISON", "BITCH", "BITER", "BLACK", "BLADE", "BLAME",
    "BLAND", "BLANK", "BLARE", "BLAST", "BLAZE", "BLEAK", "BLEED", "BLEEP", "BLEND", "BLESS",
    "BLIMP", "BLIND", "BLINK", "BLISS", "BLITZ", "BLOAT", "BLOCK", "BLOGS", "BLOKE", "BLOND",
    "BLOOD", "BLOOM", "BLOWN", "BLOWS", "BLUER", "BLUES", "BLUFF", "BLUNT", "BLURB", "BLURY",
    "BOARD", "BOAST", "BOGGY", "BONES", "BONGO", "BONNY", "BONUS", "BOOBY", "BOOED", "BOOKS",
    "BOOMY", "BOONS", "BOOTH", "BOOTS", "BOOZE", "BOOZY", "BORAX", "BORNF", "BOSOM", "BOSSX",
    "BOTCH", "BOUND", "BOWEL", "BOXER", "BRAID", "BRAIN", "BRAKE", "BRAND", "BRASH", "BRASS",
    "BRAVE", "BRAVO", "BRAWN", "BREAD", "BREAK", "BREAM", "BREED", "BRIBE", "BRICK", "BRIDE",
    "BRIEF", "BRING", "BRINK", "BRINY", "BRISK", "BROAD", "BROIL", "BROKE", "BROOM", "BROWN",
    "BRUSH", "BRUTE", "BUBBL", "BUILD", "BUILT", "BULBS", "BULGE", "BULLY", "BUMPY", "BURST",
    "BUSHY", "BUTCH", "BUYER", "BYLAW", "CABAL", "CABBY", "CABIN", "CABLE", "CACAO", "CACHE",
    "CADET", "CAGEY", "CAIRN", "CAKES", "CALCI", "CALEB", "CAMEL", "CAMEO", "CANAL", "CANDY",
    "CANOE", "CANON", "CANTY", "CAPER", "CAPUT", "CARAT", "CARGO", "CARRY", "CARVE", "CASTE",
    "CATCH", "CATER", "CAUSE", "CAVEA", "CEDAR", "CELEB", "CHAIN", "CHAIR", "CHALK", "CHAMP",
    "CHANT", "CHAOS", "CHARM", "CHART", "CHASE", "CHASM", "CHEAP", "CHEAT", "CHECK", "CHEEK",
    "CHEER", "CHESS", "CHEST", "CHIEF", "CHILD", "CHILL", "CHIME", "CHINS", "CHIPS", "CHOIR",
    "CHOKE", "CHORD", "CHORE", "CHOSE", "CHROM", "CHUNK", "CHURN", "CHUTE", "CIDER", "CIGAR",
    "CINCH", "CIRCA", "CIVIC", "CIVIL", "CLACK", "CLAIM", "CLAMP", "CLANG", "CLANK", "CLASH",
    "CLASP", "CLASS", "CLEAN", "CLEAR", "CLEAT", "CLERK", "CLICK", "CLIFF", "CLIMB", "CLING",
    "CLINK", "CLOAK", "CLOCK", "CLONE", "CLOSE", "CLOTH", "CLOUD", "CLOUT", "CLOVE", "CLOWN",
    "CLUBS", "CLUCK", "CLUMP", "CLUNG", "COACH", "COAST", "COBAL", "COBRA", "COCKS", "CODEC",
    "COLON", "COMAS", "COMFY", "COMMA", "CONCH", "CONES", "COOED", "COOKY", "COOLL", "COONS",
    "COOTY", "COPSE", "COPYF", "CORAL", "CORDS", "CORNY", "COSTY", "COUCH", "COULD", "COUNT",
    "COURT", "COVER", "COVET", "COWER", "CRACK", "CRAFT", "CRANE", "CRANK", "CRASH", "CRASS",
    "CRATE", "CRAVE", "CRAWL", "CRAZY", "CREAK", "CREAM", "CREDO", "CREED", "CREEK", "CREEP",
    "CREPT", "CRIES", "CRIME", "CRIMP", "CRISP", "CROAK", "CRONE", "CRONY", "CROOK", "CROPP",
    "CROSS", "CROWD", "CROWN", "CRUDE", "CRUEL", "CRUMB", "CRUMP", "CRUSH", "CRUST", "CRYPT",
    "CUBIC", "CULLS", "CUPID", "CURDS", "CURED", "CURIA", "CURLY", "CURRY", "CURSE", "CURVY",
    "CUSHY", "CYCLE", "CYNIC", "DAIRY", "DAISY", "DALLY", "DANCE", "DANDY", "DATED", "DATES",
    "DAUNT", "DAWNS", "DEALT", "DEARE", "DEATH", "DEBAR", "DEBIT", "DECAY", "DECKO", "DECOR",
    "DECOY", "DECRY", "DEEDS", "DEEPY", "DEFER", "DEIGN", "DEITY", "DELAY", "DELFT", "DELHI",
    "DELVE", "DEMON", "DENIM", "DENSE", "DEPOT", "DEPTH", "DERBY", "DETAX", "DETOX", "DEUCE",
    "DEVIL", "DEVON", "DIARY", "DICEY", "DIGIT", "DILEM", "DIMLY", "DINER", "DINGY", "DIODE",
    "DIRGE", "DIRTY", "DISCO", "DITCH", "DITTO", "DITTY", "DIVAN", "DIVER", "DOBBY", "DODGE",
    "DODGY", "DOGMA", "DOING", "DOLLY", "DONOR", "DONUT", "DOPEY", "DOUBT", "DOUGH", "DOWDY",
    "DOWEL", "DOWNY", "DOWRY", "DOZEN", "DRAFT", "DRAIN", "DRAKE", "DRAMA", "DRANK", "DRAPE",
    "DRAWL", "DRAWN", "DREAD", "DREAM", "DRESS", "DRIED", "DRIFT", "DRILL", "DRINK", "DRIVE",
    "DROLL", "DRONE", "DROOP", "DROSS", "DROVE", "DROWN", "DRUID", "DRUNK", "DRYLY", "DUCAL",
    "DUCKS", "DUELS", "DULLY", "DUMMY", "DUNCE", "DUNES", "DUPED", "DUPEY", "DUPLY", "DURST",
    "DUSTY", "DUTCH", "DWARF", "DWELT", "DYING", "EAGER", "EAGLE", "EARLY", "EARNS", "EARTH",
    "EASEL", "EAVES", "EBONY", "ECLAT", "EDICT", "EERIE", "EIGHT", "EJECT", "ELBOW", "ELDER",
    "ELECT", "ELEGY", "ELFIN", "ELIDE", "ELITE", "ELOPE", "ELUDE", "EMPTY", "ENACT", "ENDOW",
    "ENJOY", "ENJOY", "ENOCH", "ENROL", "ENSUE", "ENTER", "ENTRY", "ENVOY", "EPOCH", "EPOXY",
    "EQUAL", "EQUIP", "ERASE", "ERECT", "ERODE", "ERROR", "ERUPT", "ESSAY", "ESTER", "ETHIC",
    "ETHOS", "EVADE", "EVENT", "EVERY", "EVICT", "EVOKE", "EXACT", "EXALT", "EXCEL", "EXERT",
    "EXILE", "EXIST", "EXPEL", "EXTOL", "EXTRA", "EXULT", "EYING", "FABLE", "FACED", "FACET",
    "FACIA", "FACTO", "FAIRY", "FAITH", "FALSE", "FANCY", "FANCI", "FANCY", "FANGO", "FARCE",
    "FATAL", "FATTY", "FAULT", "FAUNA", "FAVOR", "FEAST", "FEINT", "FELIX", "FENCE", "FERRY",
    "FEWER", "FIBER", "FIBRE", "FIERY", "FIFTY", "FIGHT", "FILET", "FINAL", "FINCH", "FINER",
    "FIRST", "FISHY", "FIXED", "FIZZY", "FJORD", "FLACK", "FLAIL", "FLAIR", "FLAKE", "FLAKY",
    "FLAME", "FLANK", "FLARE", "FLASH", "FLASK", "FLECK", "FLEET", "FLESH", "FLICK", "FLIER",
    "FLING", "FLINT", "FLIRT", "FLOAT", "FLOCK", "FLOOR", "FLORA", "FLOSS", "FLOUR", "FLOUT",
    "FLOWS", "FLUID", "FLUNG", "FLUSH", "FLUTE", "FLYER", "FOAMS", "FOAMY", "FOCUS", "FOGGY",
    "FOIST", "FOLKS", "FORCE", "FORGE", "FORGO", "FORKS", "FORMA", "FORTE", "FORTH", "FOULE",
    "FOUND", "FOUNT", "FOURS", "FRACT", "FRAME", "FRANK", "FRAUD", "FREAK", "FRESH", "FRETS",
    "FRIAR", "FRIED", "FRIES", "FRISK", "FROCK", "FROGS", "FRONT", "FROST", "FROTH", "FROWN",
    "FROZE", "FRUIT", "FUELS", "FUMES", "FUNNY", "FURRY", "FUSEL", "FUTON", "GAILY", "GAINS",
    "GAITS", "GAMER", "GAMMA", "GAMES", "GAMUT", "GANES", "GAOLS", "GATES", "GAUGE", "GAUNT",
    "GAVEL", "GAWKY", "GECKO", "GEESE", "GENES", "GENIE", "GENRE", "GHOST", "GIANT", "GIGGY",
    "GILLS", "GIVEN", "GIVES", "GLADE", "GLARE", "GLASS", "GLAZE", "GLEAM", "GLEAN", "GLIDE",
    "GLINT", "GLOAT", "GLOBE", "GLOOM", "GLORY", "GLOSS", "GLOVE", "GLOWS", "GLUED", "GNASH",
    "GOADS", "GOALS", "GOATS", "GODLY", "GONGS", "GONNA", "GOODS", "GOODY", "GOOSE", "GORGE",
    "GOUGE", "GOURD", "GRACE", "GRADE", "GRAFT", "GRAIN", "GRAND", "GRANT", "GRAPE", "GRAPH",
    "GRASP", "GRASS", "GRATE", "GRAVE", "GRAVY", "GREAT", "GREED", "GREEN", "GREET", "GREWJ",
    "GRIEF", "GRILL", "GRIME", "GRIMY", "GRIND", "GRINS", "GRIPE", "GRIPS", "GROAN", "GROIN",
    "GROOM", "GROSS", "GROUP", "GROVE", "GROWL", "GRUDG", "GUESS", "GUEST", "GUIDE", "GUILD",
    "GUILE", "GUILT", "GULLY", "GUMMY", "GUSTO", "GUTSY", "GYPSY", "HABIT", "HAIRY", "HALLS",
    "HALVE", "HANDY", "HAPPY", "HARDY", "HAREM", "HARPY", "HARSH", "HASPS", "HASTE", "HASTY",
    "HATCH", "HATER", "HAUNT", "HAVOC", "HAZEL", "HEADY", "HEARD", "HEART", "HEATH", "HEAVE",
    "HEAVY", "HENCE", "HENRY", "HERBS", "HEXED", "HIDES", "HIRED", "HOARD", "HOBBY", "HOIST",
    "HOMER", "HONEY", "HONOR", "HORDE", "HORNY", "HORSE", "HOTEL", "HOUND", "HOURS", "HOUSE",
    "HOVER", "HOWDY", "HUMAN", "HUMID", "HUMOR", "HUMPY", "HUNTS", "HURLS", "HURRY", "HUTCH",
    "HYDRA", "HYPOC", "ICING", "IDEAL", "IDEAS", "IDIOM", "IDIOT", "IGNOR", "IMAGE", "IMPLY",
    "INANE", "INBOX", "INCUR", "INDEX", "INDIE", "INERT", "INFER", "INGOT", "INLAY", "INLET",
    "INNER", "INPUT", "INTER", "INTOX", "INTRA", "IODIC", "IRATE", "IRONY", "ISAAC", "ISLEF",
    "ISSUE", "ITCHY", "IVORY", "JABOT", "JACKS", "JADED", "JAPAN", "JAUNT", "JAZZY", "JELLY",
    "JERKY", "JESTS", "JEWEL", "JIGGY", "JINXY", "JOINT", "JOKER", "JOLLY", "JOUST", "JUDGE",
    "JUICE", "JUICY", "JUMBO", "JUMPS", "JUNKY", "JUNTA", "JUROR", "KARMA", "KAYAK", "KEBAB",
    "KEELS", "KEEPS", "KERNL", "KETCH", "KHAKI", "KIDDY", "KILLS", "KINDS", "KINGS", "KINKY",
    "KIOSK", "KITES", "KNACK", "KNAVE", "KNEAD", "KNEEL", "KNIFE", "KNITS", "KNOBS", "KNOCK",
    "KNOTS", "KNOWS", "KOALA", "LABOR", "LADEN", "LAKES", "LAMBS", "LAMPS", "LANDS", "LAPSE",
    "LARGE", "LATCH", "LATEX", "LAUGH", "LAYER", "LEARN", "LEAVE", "LEDGE", "LEMON", "LENDS",
    "LEPER", "LEVEL", "LEVER", "LIGHT", "LILAC", "LIMBO", "LIMIT", "LINED", "LINEN", "LINER",
    "LINGO", "LINKS", "LIONS", "LITHO", "LITRE", "LIVER", "LIVES", "LIVID", "LOADS", "LOAFS",
    "LOAMY", "LOBBY", "LOCAL", "LOCUS", "LODGE", "LOFTY", "LOGIC", "LOGIN", "LOOKS", "LOOSE",
    "LORDS", "LOSEF", "LOTUS", "LOUDS", "LOUNG", "LOVEJ", "LOWLY", "LUCID", "LUCKY", "LUNCH",
    "LUNGE", "LUNGS", "LURID", "LURKS", "LUSTY", "LYING", "LYMPH", "LYRIC", "MACAW", "MACRO",
    "MAGIC", "MAGMA", "MAIZE", "MAJOR", "MAKER", "MALLS", "MALTS", "MAMMA", "MANGE", "MANGO",
    "MANGY", "MANIA", "MANLY", "MAPLE", "MARCH", "MARKS", "MARSH", "MASON", "MASSY", "MATCH",
    "MATED", "MATES", "MAUVE", "MAXIM", "MAYBE", "MAYOR", "MEALY", "MEANT", "MEATS", "MEDIA",
    "MEDIC", "MELON", "MERCY", "MERGE", "MERIT", "MERRY", "METAL", "METER", "METRO", "MIDAS",
    "MIDST", "MIGHT", "MILKY", "MIMIC", "MINCE", "MINDS", "MINER", "MINOR", "MINTY", "MINUS",
    "MIRTH", "MISER", "MITER", "MIXED", "MOANS", "MOATS", "MOCAS", "MODEL", "MODEM", "MOLDS",
    "MOLLY", "MONEY", "MONTH", "MOODY", "MOOSE", "MORAL", "MORON", "MOSEY", "MOSS", "MOTEL",
    "MOTIF", "MOTOR", "MOUNT", "MOUSE", "MOUTH", "MOVED", "MOVER", "MOVES", "MOVIE", "MOWED",
    "MOWER", "MUCKY", "MUGGY", "MUMPS", "MURAL", "MUSEA", "MUSIC", "MUSKY", "MUSTY", "NABOB",
    "NADIR", "NAILS", "NAIVE", "NAKED", "NANOS", "NASTY", "NATAL", "NAVAL", "NAVEL", "NEEDY",
    "NEIGH", "NERDY", "NERVE", "NESSS", "NEVER", "NEWEL", "NICHE", "NIGHT", "NILAN", "NINJA",
    "NINTH", "NIPPY", "NOBLE", "NOISE", "NOISY", "NORTH", "NOSEY", "NOTCH", "NOVEL", "NUDGE",
    "NURSE", "NUTTY", "NYLON", "NYMPH", "OAKEN", "OBESE", "OCCUR", "OCEAN", "OCTAL", "OCTET",
    "ODDER", "ODDLY", "OFFAL", "OFFER", "OFTEN", "OLDEN", "OLDER", "OLIVE", "OMEGA", "ONION",
    "ONSET", "OPERA", "OPINE", "OPIUM", "OPTIC", "ORBIT", "ORDER", "ORGAN", "OTHER", "OUGHT",
    "OUNCE", "OUTDO", "OUTER", "OVALS", "OVARY", "OVATE", "OVERT", "OWNER", "OXIDE", "OZONE",
    "PACED", "PAGES", "PAINE", "PAINT", "PAPER", "PARER", "PARIS", "PARKA", "PARRY", "PARTY",
    "PASSE", "PASTE", "PATIO", "PATSY", "PATTY", "PAUSE", "PAYEE", "PAYER", "PEACE", "PEACH",
    "PEARL", "PECUL", "PEDAL", "PEEKU", "PEERS", "PENAL", "PENNY", "PERCH", "PERIL", "PERKY",
    "PESTO", "PETAL", "PETTY", "PHASE", "PHONE", "PHONY", "PHOTO", "PIANO", "PICKY", "PIECE",
    "PIGGY", "PILOT", "PINCH", "PINEY", "PINKY", "PINTO", "PIOUS", "PITCH", "PITTY", "PIXIE",
    "PIZZA", "PLACE", "PLAIN", "PLANK", "PLANT", "PLATE", "PLATO", "PLAZA", "PLEAD", "PLEAT",
    "PLUCK", "PLUMB", "PLUME", "PLUMP", "PLUNK", "PLUSH", "POACH", "POINT", "POISE", "POLAR",
    "POLES", "POLLS", "PONDY", "POOCH", "POOLS", "POPES", "PORCH", "PORES", "PORTS", "POSEY",
    "POTTY", "POUCH", "POUND", "POWER", "PRANK", "PRAWN", "PREEN", "PRESS", "PRICE", "PRICK",
    "PRIDE", "PRIMA", "PRIME", "PRINT", "PRIOR", "PRIZE", "PROBE", "PROCE", "PROOF", "PROUD",
    "PROVE", "PROWL", "PSALM", "PUDGY", "PUFFY", "PULPY", "PULSE", "PUNCH", "PUNNY", "PUPIL",
    "PUPPY", "PUREE", "PURGE", "PURSE", "PUSHY", "PUTTY", "PYGMY", "QUAIL", "QUAKE", "QUASH",
    "QUASI", "QUEEN", "QUELL", "QUERY", "QUEST", "QUICK", "QUIET", "QUILL", "QUILT", "QUIPS",
    "QUIRE", "QUIRK", "QUITE", "QUOTA", "QUOTE", "QUOTH", "RABBI", "RABID", "RADAR", "RADIO",
    "RAISE", "RAJAH", "RALLY", "RAMEN", "RANCH", "RANDY", "RANGE", "RAPID", "RAREB", "RAVEN",
    "RAYON", "RAZOR", "REACH", "REACT", "READY", "REALM", "REBEL", "REBUS", "REBUT", "RECALL",
    "RECIP", "RECUR", "REDDI", "REDDY", "REEDY", "REFER", "REGAL", "REGIN", "REIGN", "REINS",
    "RELAX", "RELAY", "RELIC", "REMOR", "REMOS", "RENAL", "RENEW", "REPEL", "REPUD", "REPLY",
    "RESIN", "RETCH", "RETRO", "REVEL", "REVER", "REVUE", "RHYME", "RICER", "RIDGE", "RIFLE",
    "RIGHT", "RIGID", "RIGOR", "RINSE", "RIPEN", "RISEN", "RISER", "RISKY", "RIVAL", "RIVER",
    "RIVET", "ROACH", "ROADS", "ROAMS", "ROAST", "ROBIN", "ROBOT", "ROCKY", "RODEO", "ROGUE",
    "ROOMY", "ROOST", "ROTOR", "ROUGE", "ROUGH", "ROUND", "ROUSE", "ROUTE", "ROVER", "ROWDY",
    "ROWER", "ROYAL", "RUBLE", "RUDDY", "RULER", "RUMOR", "RUMPH", "RUNNY", "RURAL", "RUSTY",
    "SABER", "SADLY", "SAFEN", "SAFER", "SAGES", "SAINT", "SALAD", "SALLY", "SALON", "SALSA",
    "SALTY", "SALVE", "SAMBA", "SAMPL", "SANDY", "SANER", "SAPID", "SARGE", "SATIN", "SAUCE",
    "SAUNA", "SAVOR", "SCALD", "SCANT", "SCARF", "SCARY", "SCENT", "SCION", "SCOFF", "SCOLD",
    "SCOPE", "SCORE", "SCOUR", "SCOUT", "SCRAW", "SCREW", "SCRUB", "SCUBA", "SEAMY", "SEALS",
    "SEAMS", "SEANS", "SEATS", "SEDAN", "SEEDY", "SEEMS", "SELDO", "SELFY", "SENSE", "SERGE",
    "SERVE", "SEVEN", "SEVER", "SEWER", "SHADE", "SHADY", "SHAFT", "SHAKE", "SHAKY", "SHALE",
    "SHALL", "SHAME", "SHAPE", "SHARD", "SHARE", "SHARK", "SHARP", "SHAVE", "SHAWL", "SHEAF",
    "SHEAR", "SHEDS", "SHEEN", "SHEEP", "SHEER", "SHELF", "SHELL", "SHINE", "SHINY", "SHIPS",
    "SHIRT", "SHOCK", "SHONE", "SHOOK", "SHOOT", "SHORE", "SHORT", "SHOUT", "SHOWN", "SHOWY",
    "SHREW", "SHRUB", "SHRUG", "SHUNT", "SHUSH", "SIEGE", "SIGHT", "SIGMA", "SIGNS", "SILAS",
    "SILKY", "SINEW", "SINKY", "SIREN", "SIXTY", "SKATE", "SKEEN", "SKIER", "SKILL", "SKIMP",
    "SKINK", "SKINS", "SKIRT", "SKULL", "SLACK", "SLAIN", "SLAMS", "SLANG", "SLANT", "SLASH",
    "SLATE", "SLAVE", "SLEEP", "SLEET", "SLEPT", "SLICE", "SLICK", "SLIDE", "SLING", "SLINK",
    "SLIPS", "SLITS", "SLOPE", "SLOTH", "SLUMP", "SLUNG", "SLUNK", "SLURP", "SLUSH", "SMALL",
    "SMART", "SMASH", "SMEAR", "SMELL", "SMELT", "SMILE", "SMIRK", "SMITE", "SMITH", "SMOCK",
    "SMOGS", "SMOKE", "SMOKY", "SMOTE", "SNACK", "SNAIL", "SNAKE", "SNAPS", "SNARE", "SNARL",
    "SNEAK", "SNIFF", "SNIPS", "SNOBB", "SNORE", "SNORT", "SNOUT", "SNOWY", "SNUCK", "SOAPY",
    "SOARE", "SOARS", "SOBER", "SOILS", "SOLAR", "SOLID", "SOLVE", "SONAR", "SONGS", "SONIC",
    "SOOTY", "SORTS", "SOUND", "SOURS", "SOUTH", "SPACE", "SPADE", "SPAKE", "SPANK", "SPARE",
    "SPARK", "SPASM", "SPAWN", "SPEAR", "SPECK", "SPEED", "SPELL", "SPEND", "SPENT", "SPICE",
    "SPICY", "SPIKE", "SPIKY", "SPINE", "SPINY", "SPIRL", "SPITE", "SPLIT", "SPOIL", "SPOKE",
    "SPOON", "SPORT", "SPOTL", "SPRAT", "SPRAY", "SPREE", "SPURN", "SQUAB", "SQUAD", "SQUAT",
    "STAFF", "STAGE", "STAID", "STAIN", "STAIR", "STAKE", "STALE", "STALK", "STAMP", "STAND",
    "STARE", "START", "STATE", "STEAD", "STEAM", "STEED", "STEEL", "STEEP", "STEER", "STELL",
    "STEMS", "STEPS", "STERN", "STICK", "STIFF", "STILL", "STING", "STINK", "STIRR", "STOCK",
    "STOIC", "STOKE", "STOLE", "STOMP", "STONE", "STOOD", "STORE", "STORM", "STORY", "STOUT",
    "STOVE", "STRAP", "STRAW", "STRAY", "STRIP", "STRUT", "STUFF", "STUMP", "STUNG", "STUNK",
    "STUNT", "STYLE", "SUAVE", "SUGAR", "SULFU", "SULLY", "SUMAC", "SUNNY", "SUPER", "SURGE",
    "SURLY", "SWAMP", "SWARM", "SWATH", "SWEAR", "SWEAT", "SWEEP", "SWEET", "SWELL", "SWIFT",
    "SWINE", "SWING", "SWIRL", "SWISH", "SWORN", "SWUNG", "SYCAM", "SYMPH", "SYNOD", "TABLE",
    "TAINT", "TAKEN", "TASTE", "TATAR", "TAUNT", "TAWNY", "TEACH", "TEASE", "TEETH", "TENON",
    "TENSE", "TENTS", "TERMS", "TERSE", "TESTY", "THANK", "THEIR", "THEME", "THERE", "THESE",
    "THICK", "THIEF", "THIGH", "THING", "THINK", "THIRD", "THONG", "THORN", "THOSE", "THREE",
    "THREW", "THROB", "THROW", "THUMB", "THUMP", "TIDAL", "TIGER", "TIGHT", "TILED", "TIMER",
    "TIMID", "TINCH", "TINES", "TINSE", "TINTY", "TIRED", "TITLE", "TOADY", "TODAY", "TOKEN",
    "TOMBS", "TONAL", "TONGS", "TONIC", "TOPAZ", "TOPIC", "TORSO", "TOTAL", "TOUCH", "TOUGH",
    "TOWEL", "TOWER", "TOXIC", "TRACE", "TRACK", "TRADE", "TRAIL", "TRAIN", "TRAMP", "TRASH",
    "TRAWL", "TREAD", "TREAS", "TREAT", "TREND", "TRIAD", "TRIAL", "TRIBE", "TRICK", "TRITE",
    "TRIVS", "TROOP", "TROPE", "TROSS", "TRUCK", "TRULY", "TRUMP", "TRUNK", "TRUST", "TRUTH",
    "TRYST", "TUBER", "TULIP", "TUMMY", "TUNAS", "TUNER", "TUNIC", "TURBO", "TURNS", "TURNS",
    "TWICE", "TWINE", "TWINS", "TWIRL", "TYING", "TYPES", "UNCLE", "UNDER", "UNDID", "UNDOX",
    "UNDUE", "UNIFY", "UNION", "UNITE", "UNITY", "UNZIP", "UPPER", "UPSET", "URBAN", "URGED",
    "USHER", "USUAL", "VAGUE", "VALET", "VALID", "VALUE", "VALVE", "VAPID", "VAPOR", "VAULT",
    "VAUNT", "VEGAN", "VENOM", "VENUE", "VERGE", "VERSE", "VERSO", "VERVE", "VESPA", "VESTS",
    "VIBES", "VICAR", "VIDEO", "VIGIL", "VIGOR", "VILLA", "VINEG", "VINYL", "VIOLA", "VIPER",
    "VIRAL", "VIRUS", "VISIT", "VITAL", "VIVID", "VOCAL", "VOGUE", "VOICE", "VOIDR", "VOLTS",
    "VOTER", "VOWEL", "WACKY", "WAGER", "WAGON", "WAIST", "WAIVE", "WAKES", "WALKS", "WALLS",
    "WANTS", "WARML", "WARPS", "WASTE", "WATCH", "WATER", "WAVES", "WEAKY", "WEANS", "WEARS",
    "WEARY", "WEAVE", "WEEDS", "WEEKS", "WEIGH", "WEIRD", "WHACK", "WHALE", "WHARF", "WHEAT",
    "WHEEL", "WHERE", "WHICH", "WHILE", "WHIMS", "WHINE", "WHINY", "WHIRL", "WHITE", "WHOLE",
    "WHOOP", "WHORE", "WHOSE", "WIDEN", "WIDER", "WIDOW", "WIDTH", "WIEST", "WIGHT", "WILDL",
    "WINCE", "WINCH", "WINDS", "WINDY", "WINEP", "WINGS", "WINKY", "WINNS", "WIPES", "WIRES",
    "WISHY", "WITCH", "WITTY", "WOMAN", "WOMBS", "WOMEN", "WOODY", "WORDY", "WORKS", "WORLD",
    "WORMS", "WORRY", "WORSE", "WORST", "WORTH", "WOULD", "WOUND", "WOVEN", "WRATH", "WRIST",
    "WRITE", "WRONG", "WROTE", "YACHT", "YARDS", "YARNS", "YEARS", "YEAST", "YELLS", "YIELD",
    "YOUNG", "YOURS", "YOUTH", "ZEALS", "ZEBRA",
    "ZESTY", "ZILCH", "ZINGS", "ZONAL"
]);

const gameBoard = document.getElementById('game-board');
const guessInput = document.getElementById('guess-input');
const submitButton = document.getElementById('submit-guess');
const messageDisplay = document.getElementById('message');
const winLoseMessageDisplay = document.getElementById('win-lose-message');

// Initialize the game board with empty rows and boxes
function initializeBoard() {
    for (let i = 0; i < MAX_GUESSES; i++) {
        const row = document.createElement('div');
        row.classList.add('word-row');
        row.id = `row-${i}`;
        for (let j = 0; j < WORD_LENGTH; j++) {
            const box = document.createElement('div');
            box.classList.add('letter-box');
            box.id = `box-${i}-${j}`;
            row.appendChild(box);
        }
        gameBoard.appendChild(row);
    }
}

// Function to display messages
function showMessage(msg, isError = true) {
    messageDisplay.textContent = msg;
    messageDisplay.style.color = isError ? 'red' : 'green';
    // Clear message after a short delay if it's an error
    if (isError) {
        setTimeout(() => {
            messageDisplay.textContent = '';
        }, 3000);
    }
}

// Handle a submitted guess
function handleSubmitGuess() {
    if (gameEnded) return;

    const guess = guessInput.value.toUpperCase();
    guessInput.value = ''; // Clear input field

    if (guess.length !== WORD_LENGTH) {
        showMessage(`Guess must be ${WORD_LENGTH} letters long!`);
        return;
    }

    if (!VALID_WORDS.has(guess)) {
        showMessage('Not a valid word!');
        return;
    }

    checkGuess(guess);
}

// Check the guess against the secret word and update the UI
function checkGuess(guess) {
    const secretWordLetters = SECRET_WORD.split('');
    const guessLetters = guess.split('');
    const currentRowElement = document.getElementById(`row-${currentGuess}`);
    const letterStatus = Array(WORD_LENGTH).fill(''); // To track status for each letter

    // First pass: Mark correct (green) letters and track remaining letters for yellow/gray
    let tempSecret = [...secretWordLetters]; // Use a mutable copy for marking used letters

    for (let i = 0; i < WORD_LENGTH; i++) {
        const box = document.getElementById(`box-${currentGuess}-${i}`);
        box.textContent = guessLetters[i];

        if (guessLetters[i] === secretWordLetters[i]) {
            letterStatus[i] = 'correct';
            tempSecret[i] = null; // Mark as used
        }
    }

    // Second pass: Mark present (yellow) and absent (gray) letters
    for (let i = 0; i < WORD_LENGTH; i++) {
        const box = document.getElementById(`box-${currentGuess}-${i}`);

        if (letterStatus[i] === 'correct') {
            box.classList.add('correct');
            continue; // Already handled
        }

        const indexInSecret = tempSecret.indexOf(guessLetters[i]);
        if (indexInSecret !== -1) {
            letterStatus[i] = 'present';
            box.classList.add('present');
            tempSecret[indexInSecret] = null; // Mark as used
        } else {
            letterStatus[i] = 'absent';
            box.classList.add('absent');
        }
    }

    showMessage(''); // Clear any previous error messages

    // Check for win/lose conditions
    if (guess === SECRET_WORD) {
        winGame();
    } else if (currentGuess === MAX_GUESSES - 1) {
        loseGame();
    } else {
        currentGuess++;
    }
}

// Handle game win
function winGame() {
    gameEnded = true;
    submitButton.disabled = true;
    guessInput.disabled = true;
    winLoseMessageDisplay.classList.remove('hidden');
    winLoseMessageDisplay.innerHTML = `
        Congratulations on guessing the right word, you are inception ready, register now!
        <a href="https://your-registration-link.com" target="_blank">Register Here!</a>
    `;
    winLoseMessageDisplay.style.backgroundColor = '#d4edda'; // Light green background
    winLoseMessageDisplay.style.color = '#155724'; // Dark green text
}

// Handle game loss
function loseGame() {
    gameEnded = true;
    submitButton.disabled = true;
    guessInput.disabled = true;
    winLoseMessageDisplay.classList.remove('hidden');
    winLoseMessageDisplay.innerHTML = `
        You ran out of guesses! The word was: <strong>${SECRET_WORD}</strong>.
        Better luck next time!
    `;
    winLoseMessageDisplay.style.backgroundColor = '#f8d7da'; // Light red background
    winLoseMessageDisplay.style.color = '#721c24'; // Dark red text
}

// Event Listeners
submitButton.addEventListener('click', handleSubmitGuess);
guessInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleSubmitGuess();
    }
});

// Initialize the game when the page loads
initializeBoard();