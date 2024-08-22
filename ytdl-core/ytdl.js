const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

/**
 * Downloads a YouTube video to the specified directory.
 * @param {string} url - The URL of the YouTube video.
 * @param {string} downloadPath - The directory where the video will be saved.
 * @returns {Promise<string>} - The path to the downloaded video file.
 */
async function downloadVideo(url, downloadPath) {
  const info = await ytdl.getInfo(url);
  const videoTitle = info.videoDetails.title.replace(/[<>:"/\\|?*]+/g, ''); // Clean the title
  const videoPath = path.join(downloadPath, `${videoTitle}.mp4`);

  return new Promise((resolve, reject) => {
    ytdl(url, { quality: 'highest' })
      .pipe(fs.createWriteStream(videoPath))
      .on('finish', () => resolve(videoPath))
      .on('error', (error) => reject(error));
  });
}

/**
 * @type {Command}
 */
const youtubeDownloaderPlugin = {
  name: 'ytdl',
  description: 'Downloads YouTube videos',
  subcommands: [
    {
      name: 'download',
      description: 'Downloads a YouTube video from the provided URL',
      execute: async (args) => {
        if (args.length < 2) {
          return { text: 'Usage: youtube download <URL> <downloadPath>', type: 'error' };
        }

        const [url, downloadPath] = args;
        if (!ytdl.validateURL(url)) {
          return { text: 'Error: The provided URL is not a valid YouTube URL.', type: 'error' };
        }

        try {
          const videoPath = await downloadVideo(url, downloadPath);
          return { text: `Video downloaded successfully: ${videoPath}`, type: 'output' };
        } catch (error) {
          return { text: `Error downloading video: ${error.message}`, type: 'error' };
        }
      },
    },
    {
      name: 'info',
      description: 'Fetches and displays information about the provided YouTube video URL',
      execute: async (args) => {
        if (args.length < 1) {
          return { text: 'Usage: youtube info <URL>', type: 'error' };
        }

        const url = args[0];
        if (!ytdl.validateURL(url)) {
          return { text: 'Error: The provided URL is not a valid YouTube URL.', type: 'error' };
        }

        try {
          const info = await ytdl.getInfo(url);
          const { title, lengthSeconds, viewCount, author } = info.videoDetails;
          return {
            text: `Title: ${title}\nDuration: ${lengthSeconds} seconds\nViews: ${viewCount}\nUploader: ${author.name}`,
            type: 'output',
          };
        } catch (error) {
          return { text: `Error fetching video info: ${error.message}`, type: 'error' };
        }
      },
    },
    {
      name: 'help',
      description: 'Lists all available YouTube downloader commands or provides help on a specific command',
      execute: async (args) => {
        if (args.length === 0) {
          return {
            text: youtubeDownloaderPlugin.subcommands
              .map(cmd => `${cmd.name}: ${cmd.description}`)
              .join('\n'),
            type: 'output',
          };
        }

        const command = args[0];
        const cmd = youtubeDownloaderPlugin.subcommands.find(cmd => cmd.name === command);
        if (cmd) {
          return { text: `${command}: ${cmd.description}`, type: 'output' };
        }

        return { text: `No help available for command "${command}".`, type: 'error' };
      },
    },
  ],
  execute: () => ({ text: 'This command has subcommands. Use "youtube <subcommand>"', type: 'error' }),
};

module.exports = {
  commands: {
    [youtubeDownloaderPlugin.name]: youtubeDownloaderPlugin,
  },
};
