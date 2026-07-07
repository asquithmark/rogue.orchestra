export type CreditSegment = {
  text: string;
  href?: string;
};

export type Track = {
  number: number;
  title: string;
  durationLabel: string;
  audioSrc: string;
  credit: CreditSegment[];
  creditText: string;
};

const audio = (fileName: string) => `./assets/audio/${fileName}`;

const creditText = (segments: CreditSegment[]) => segments.map((segment) => segment.text).join("");

const track = (
  number: number,
  title: string,
  durationLabel: string,
  fileName: string,
  credit: CreditSegment[]
): Track => ({
  number,
  title,
  durationLabel,
  audioSrc: audio(fileName),
  credit,
  creditText: creditText(credit)
});

export const tracks: Track[] = [
  track(1, "please don’t wake me up", "5:11", "01-please-dont-wake-me-up.m4a", [
    { text: "Original composition, includes a remake of " },
    { text: "Claude Debussy's \"Clair De Lune\"", href: "https://youtu.be/-Bxpm0EmOMU" },
    { text: ", inspired by " },
    { text: "Janelle Monae's \"Say You'll Go\"", href: "https://youtu.be/k_P08n8cyYk" }
  ]),
  track(2, "la ultima quedada del verano", "5:09", "02-la-ultima-quedada-del-verano.mp3", [
    { text: "Original composition, inspired by " },
    {
      text: "Louis Armstrong, Ella Fitzgerald's \"Summertime\"",
      href: "https://youtu.be/2HJCN3upMHE"
    }
  ]),
  track(3, "on the floor in the round", "2:21", "03-on-the-floor-in-the-round.m4a", [
    { text: "Remake of " },
    {
      text: "Aloe Blacc, Mihalj 'Miki' Kekenj & Jaybo's \"Billy Jean, Live at MADE\"",
      href: "https://youtu.be/gKL9Vw_ivIo"
    }
  ]),
  track(4, "sucia", "1:12", "04-sucia.m4a", [
    { text: "Original composition, includes a remake of " },
    {
      text: "Kehlani feat. Jill Scott & Young Miko's \"Sucia\"",
      href: "https://www.youtube.com/watch?v=xoIkT0252vQ"
    },
    { text: "." }
  ]),
  track(5, "heavy gone", "2:48", "05-heavy-gone.m4a", [
    { text: "Original composition, includes a remake inspired by " },
    {
      text: "Jamie Woon's \"Heavy Going...\"",
      href: "https://www.youtube.com/watch?v=3dHxjUl-NaU"
    },
    { text: "." }
  ]),
  track(6, "just like a child", "1:15", "06-just-like-a-child.mp3", [
    { text: "Remake of " },
    { text: "Mary Mary's \"Still My Child (Interlude)\"", href: "https://youtu.be/-5e9_e0jW6Y" }
  ]),
  track(7, "judgement", "3:08", "07-judgement.m4a", [
    { text: "Original composition, includes a remake of " },
    {
      text: "Janelle Monáe's \"Don't Judge Me\"",
      href: "https://www.youtube.com/watch?v=BYlW67CMRKM"
    },
    { text: "." }
  ]),
  track(8, "andromedic pause", "1:23", "08-andromedic-pause.m4a", [
    { text: "Original composition, inspired by " },
    { text: "Ethel's \"Andromeda\"", href: "https://youtu.be/1uk2V-ABifo" },
    { text: " and " },
    { text: "Grace Jones' \"My Jamaican Guy\"", href: "https://youtu.be/nhMA6attV0Y" }
  ]),
  track(9, "play it like we’re alone", "2:40", "09-play-it-like-were-alone.mp3", [
    { text: "Original composition, inspired by " },
    { text: "Claudja Barry's \"Love for the Sake of Love\"", href: "https://youtu.be/wQE10jVyAnE" }
  ]),
  track(10, "tu y yo", "5:18", "10-tu-y-yo.m4a", [
    { text: "Original composition, inspired by " },
    {
      text: "Flume's \"You & Me (Flume Remix)\"",
      href: "https://www.youtube.com/watch?v=8x-M7AkTvrQ"
    },
    { text: " and " },
    {
      text: "MEUTE's \"You & Me (Flume Remix)\"",
      href: "https://www.youtube.com/watch?v=fKFbnhcNnjE"
    },
    { text: "." }
  ]),
  track(11, "hurry, or we’ll miss the train", "3:11", "11-hurry-or-well-miss-the-train.mp3", [
    { text: "Original composition" }
  ]),
  track(12, "thaw", "2:18", "12-thaw.mp3", [
    { text: "Original composition, inspired by " },
    { text: "Madonna's \"Frozen\"", href: "https://youtu.be/XS088Opj9o0" },
    {
      text: " including an audio sample of rehearsal instructions by conductor Victor Vallo Jr. from the "
    },
    {
      text: "Durgee Jr. High School Orchestra Rehearsal",
      href: "https://youtu.be/JpLoMUvKgtQ"
    }
  ]),
  track(13, "the pit goes rogue", "5:31", "13-the-pit-goes-rogue.mp3", [
    { text: "Original composition" }
  ]),
  track(14, "the last straw", "1:31", "14-the-last-straw.mp3", [
    { text: "Original composition" }
  ]),
  track(15, "the great escape", "5:06", "15-the-great-escape.mp3", [
    { text: "Original composition" }
  ]),
  track(16, "eat, pray, love", "3:08", "16-eat-pray-love.mp3", [
    { text: "Original composition" }
  ])
];
