import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { Request, Response, NextFunction } from 'express';
@Injectable()
export class MovieService {
  movies: Movie[] = [
    {
      id: 1,
      title: 'The Godfather'
    },
    {
      id: 2,
      title: 'Forrest Gump'
    },
    {
      id: 3,
      title: 'Pulp Ficton'
    },
  ];

  getAllMovies(): Movie[] {
    return this.movies;
  }

  getMovie(id: number): Movie {
    return this.movies.filter((r) => r.id == id)[0];
  }

  removeMovie(id: number): Movie {
    // TODO
    return this.getMovie(id);
  }
}


export class Movie {

  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;
}

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, path: url } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('close', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.log(
        `${method} ${request.url} ${url} ${statusCode} ${ip}`
      );
    });

    next();
  }
}