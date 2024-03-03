import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Header from '../Header';
import LeaderBoard from './LeaderBoard';
import DrawingArea from './DrawingArea';
import axiosInstance from '../../utils/axiosInstance';

const drawItems = [
  "smiley_face",
  "octagon",
  "hexagon",
  "ear",
  "potato",
  "face",
  "necklace",
  "nose",
  "peanut",
  "sun",
  "animal_migration",
  "stitches",
  "stethoscope",
  "bread",
  "beard",
  "crab",
  "blueberry",
  "rain",
  "moustache",
  "mouse",
  "hedgehog",
  "snowman",
  "moon",
  "strawberry",
  "yoga",
  "cookie",
  "steak",
  "pillow",
  "nail",
  "circle",
  "toe",
  "blackberry",
  "baseball",
  "paper_clip",
  "diamond",
  "goatee",
  "eyeglasses",
  "angel",
  "string_bean",
  "knee",
  "cactus",
  "camouflage",
  "watermelon",
  "flying_saucer",
  "squiggle",
  "light_bulb",
  "frog",
  "river",
  "fish",
  "bird",
  "power_outlet",
  "bottlecap",
  "pond",
  "bracelet",
  "feather",
  "donut",
  "ant",
  "garden_hose",
  "lion",
  "brain",
  "pliers",
  "pear",
  "microphone",
  "spoon",
  "bush",
  "rifle",
  "grapes",
  "campfire",
  "peas",
  "bear",
  "cello",
  "mouth",
  "cat",
  "onion",
  "syringe",
  "spider",
  "hockey_puck",
  "harp",
  "raccoon",
  "monkey",
  "bandage",
  "clock",
  "octopus",
  "sweater",
  "compass",
  "pool",
  "remote_control",
  "map",
  "sleeping_bag",
  "frying_pan",
  "matches",
  "cloud",
  "sheep",
  "drill",
  "hot_tub",
  "line",
  "bathtub",
  "mermaid",
  "stop_sign",
  "leaf",
  "ocean",
  "owl",
  "tooth",
  "streetlight",
  "foot",
  "wine_bottle",
  "lollipop",
  "penguin",
  "lobster",
  "diving_board",
  "hurricane",
  "boomerang",
  "sock",
  "apple",
  "broccoli",
  "bat",
  "coffee_cup",
  "flip_flops",
  "cake",
  "sink",
  "mosquito",
  "skull",
  "wheel",
  "headphones",
  "bench",
  "square",
  "bowtie",
  "wristwatch",
  "camel",
  "hot_air_balloon",
  "tiger",
  "hourglass",
  "snake",
  "basketball",
  "backpack",
  "marker",
  "cow",
  "trumpet",
  "hat",
  "hand",
  "mushroom",
  "parrot",
  "horse",
  "zebra",
  "snorkel",
  "key",
  "dumbbell",
  "banana",
  "dog",
  "teddy-bear",
  "birthday_cake",
  "sea_turtle",
  "soccer_ball",
  "belt",
  "toothpaste",
  "suitcase",
  "paint_can",
  "umbrella",
  "mug",
  "drums",
  "elbow",
  "bucket",
  "pig",
  "whale",
  "motorbike",
  "popsicle",
  "stove",
  "bee",
  "keyboard",
  "jacket",
  "panda",
  "The_Mona_Lisa",
  "beach",
  "passport",
  "leg",
  "eye",
  "waterslide",
  "laptop",
  "hockey_stick",
  "finger",
  "scorpion",
  "squirrel",
  "violin",
  "golf_club",
  "dolphin",
  "snowflake",
  "binoculars",
  "tornado",
  "oven",
  "floor_lamp",
  "anvil",
  "axe",
  "eraser",
  "cruise_ship",
  "fork",
  "helmet",
  "calendar",
  "cannon",
  "duck",
  "lipstick",
  "telephone",
  "snail",
  "aircraft_carrier",
  "knife",
  "tennis_racquet",
  "chandelier",
  "canoe",
  "van",
  "computer",
  "clarinet",
  "alarm_clock",
  "crayon",
  "skyscraper",
  "cooler",
  "stereo",
  "asparagus",
  "shovel",
  "basket",
  "sandwich",
  "toaster",
  "see_saw",
  "envelope",
  "cup",
  "parachute",
  "trombone",
  "roller_coaster",
  "saw",
  "rhinoceros",
  "tent",
  "pizza",
  "vase",
  "door",
  "candle",
  "kangaroo",
  "hamburger",
  "rake",
  "dragon",
  "pants",
  "lighter",
  "purse",
  "pickup_truck",
  "table",
  "flashlight",
  "mountain",
  "spreadsheet",
  "triangle",
  "hot_dog",
  "pencil",
  "tree",
  "paintbrush",
  "speedboat",
  "saxophone",
  "skateboard",
  "scissors",
  "teapot",
  "shoe",
  "lightning",
  "dresser",
  "megaphone",
  "washing_machine",
  "screwdriver",
  "postcard",
  "radio",
  "car",
  "book",
  "rollerskates",
  "ice_cream",
  "arm",
  "chair",
  "swan",
  "shark",
  "broom",
  "cell_phone",
  "garden",
  "lantern",
  "bulldozer",
  "fire_hydrant",
  "pineapple",
  "butterfly",
  "crocodile",
  "t-shirt",
  "rabbit",
  "bicycle",
  "wine_glass",
  "camera",
  "swing_set",
  "elephant",
  "flamingo",
  "police_car",
  "calculator",
  "fireplace",
  "flower",
  "dishwasher",
  "grass",
  "church",
  "guitar",
  "toothbrush",
  "helicopter",
  "carrot",
  "ambulance",
  "mailbox",
  "piano",
  "ceiling_fan",
  "crown",
  "baseball_bat",
  "barn",
  "The_Great_Wall_of_China",
  "sailboat",
  "tractor",
  "truck",
  "submarine",
  "firetruck",
  "microwave",
  "shorts",
  "airplane",
  "stairs",
  "fan",
  "lighthouse",
  "bridge",
  "hammer",
  "fence",
  "toilet",
  "traffic_light",
  "television",
  "couch",
  "rainbow",
  "ladder",
  "hospital",
  "zigzag",
  "school_bus",
  "bus",
  "giraffe",
  "train",
  "house",
  "house_plant",
  "star",
  "sword",
  "bed",
  "palm_tree",
  "windmill",
  "jail",
  "castle",
  "The_Eiffel_Tower",
  "picture_frame"
]

function Game() {
  const [store, setStore] = useState(null);
  const [score, setScore] = useState(null);
  const [drawItem, setDrawItem] = useState(null);

  useEffect(() => {
    const mid = {
      canvasWidth: '',
      canvasHeight: '',
      LeaderBoardWidth: '',
      LeaderBoardHeight: ''
    };
    mid.canvasHeight = window.innerHeight * (65 / 100);
    mid.canvasWidth = window.innerWidth * (50 / 100);
    mid.LeaderBoardWidth = window.innerWidth * (30 / 100);
    setStore(mid);
  }, [])

  useEffect(() => {
    if (!score || !drawItem) return;
    axiosInstance.post('/game', { token: localStorage.getItem('token'), score, drawingName: drawItem })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [score, drawItem])

  return (
    <div>
      <Header />
      {
        store && (
          <div style={{ height: 'calc(100vh - 100px)', width: '100vw' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              {
                score ? (
                  <>
                    <Box style={{ width: '55vw' }}>
                      <DrawingArea drawItem={drawItems[parseInt(Math.random() * drawItems.length)]} width={store.canvasWidth} height={store.canvasHeight} setScore={setScore} setDrawItem={setDrawItem} />
                    </Box>
                    <Box style={{ width: '35vw' }}>
                      <LeaderBoard width={store.LeaderBoardWidth} score={score} />
                    </Box>
                  </>
                ) : (
                  <Box style={{ width: '80vw' }}>
                    <DrawingArea drawItem={drawItems[parseInt(Math.random() * drawItems.length)]} width={store.canvasWidth} height={store.canvasHeight} setScore={setScore} setDrawItem={setDrawItem} />
                  </Box>
                )
              }
            </div>
          </div>
        )
      }
    </div>
  )
}

export default Game


{/* <div>
<Typography textAlign={'center'}>
  Play a game with your friends by entering in a room with ID
</Typography>
<div style={{ display: 'flex', justifyContent: 'center' }}>
  <Button sx={{ marginBottom: '40px' }}>
    Enter a room <ArrowForwardIosOutlinedIcon sx={{ width: '20px', height: '20px' }} />
  </Button>
</div>
</div>
<div>
<Typography textAlign={'center'}>
  Create a room and play with your friends by sharing room ID with your mates
</Typography>
<div style={{ display: 'flex', justifyContent: 'center' }}>
  <Button sx={{ marginBottom: '40px' }}>
    Create a room <ArrowForwardIosOutlinedIcon sx={{ width: '20px', height: '20px' }} />
  </Button>
</div>
</div>
<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '10px' }}>
<Typography textAlign={'center'}>
  Number of matches played: {data.matches}
</Typography>
<Typography textAlign={'center'}>
  Number of matches won: {data.matchesWon}
</Typography>
<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
  <Button onClick={() => { }}>
    Click for past matches <ArrowForwardOutlinedIcon sx={{ width: '20px', height: '20px' }} />
  </Button>
</div>
</div> */}