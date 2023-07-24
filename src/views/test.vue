<template>
  <div>
    <input type="file" ref="videoFile" />
    <input type="file" ref="audioFile" />
    <button @click="mergeVideoAndAudio">合成视频</button>
    <video ref="outputVideo" controls></video>
  </div>
</template>

<script>
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

export default {
  name: "TestCom",
  methods: {
    async mergeVideoAndAudio() {
      const ffmpeg = createFFmpeg({ log: true });

      console.log(1);
      // 加载FFmpeg
      await ffmpeg.load();
      console.log(2);
      // 读取视频文件
      const videoFile = this.$refs.videoFile.files[0];
      await ffmpeg.write("video.mp4", await fetchFile(videoFile));

      console.log(3);
      // 读取音频文件
      const audioFile = this.$refs.audioFile.files[0];
      await ffmpeg.write("audio.mp3", await fetchFile(audioFile));
      console.log(4);
      // 合成视频和音频
      await ffmpeg.run(
        "-i",
        "video.mp4",
        "-i",
        "audio.mp3",
        "-c:v",
        "copy",
        "-c:a",
        "aac",
        "output.mp4"
      );

      // 获取合成后的视频文件
      const outputVideoBuffer = await ffmpeg.read("output.mp4");

      // 将视频文件转换为Blob对象
      const outputVideoBlob = new Blob([outputVideoBuffer.buffer], {
        type: "video/mp4",
      });
      console.log(outputVideoBlob);
      // 创建一个URL，用于在页面上显示合成后的视频
      const outputVideoURL = URL.createObjectURL(outputVideoBlob);
      console.log(outputVideoURL);

      // 在页面上显示合成后的视频
      const videoElement = this.$refs.outputVideo;
      videoElement.src = outputVideoURL;
    },
  },
};
</script>
