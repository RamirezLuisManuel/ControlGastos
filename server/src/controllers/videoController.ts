import { Request, Response } from 'express';
import axios from 'axios';
import keys from '../keys';

export class VideoController {
  async searchVideo(req: Request, res: Response) {
    const { query } = req.body;
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${keys.youtubeConfig.apiyoutube}`
      );
      res.json(response.data.items);
    } catch (error) {
      res.status(500).json({ message: 'Error buscando videos', error });
    }
  }
}

export const videoController = new VideoController();
