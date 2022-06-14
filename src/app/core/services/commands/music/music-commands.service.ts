// import { Message, Client, MessageEmbed, VoiceConnection } from 'discord.js';
// import { injectable } from 'inversify';

// import { from, of, defer } from 'rxjs';
// import { tap, switchMap, zipWith } from 'rxjs/operators';

// import ytdl, { videoInfo } from 'ytdl-core';

// @injectable()
// export class MusicCommandsService {

//   constructor() { }


//   /**
//    * Quotes Commands Central
//    */

//    musicCommands(message: Message, client: Client) {
//     const [command, ytUrl] = message.content.split(" ");

//     switch (true) {
//       case (!!ytUrl && ytUrl.startsWith('https://www.youtube') || ytUrl.startsWith('https://youtu.be')):
//         return this.playYTSong(message, client, ytUrl);

//       case (command.startsWith("!stop") || command === "!s"):
//         return this.stopYTSong(message, client);

//       default:
//         return defer(() => from(message.channel.send("Please input a valid YouTube link.")));
//     }
//   }


//   /**
//    * Play YT
//    */

//   playYTSong(message: Message, client: Client, ytUrl: string) {
//     const voiceChannel = message.member.voice.channel;
//     const permissions = voiceChannel?.permissionsFor(message.client.user);

//     const queueHandler = voiceChannel
//       ? permissions.has("CONNECT") || permissions.has("SPEAK")
//         ? ytdl.getInfo(ytUrl)
//         : message.channel.send("I don't have permission either to join or to sing.")
//       : message.channel.send("You are not in a voice channel.");

//     return defer(() => from(queueHandler).pipe(
//       zipWith(message.member.voice.channel.join()),
//       tap((
//         [stream, voiceChannel]: [stream: videoInfo, voiceChannel: VoiceConnection ]
//       ) => {
//         return voiceChannel
//           .play(ytdl(stream.videoDetails.video_url))
//           .on("finish", () => voiceChannel.disconnect())
//           .on("error", err => console.log(err))
//       }),
//       switchMap(([stream, _]) => {
//         const duration = new Date(0);
//         duration.setSeconds(+stream.videoDetails.lengthSeconds);

//         const embedStream = new MessageEmbed()
//         .setColor(0xec407a)
//         .setTitle(stream.videoDetails.title)
//         .addField("Duration:", duration.toISOString().substr(11, 8))
//         .addField("Requested by:", message.member.displayName)
//         .setThumbnail(stream.videoDetails.thumbnails[0].url);

//         return message.channel.send(embedStream);
//       })
//     ))
//   }


//   /**
//    * Stop YT
//    */

//   stopYTSong(message: Message, client: Client) {
//     return defer(() => of(message.member.voice.channel.leave()));
//   }
// }