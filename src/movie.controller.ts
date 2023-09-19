import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard, AuthenticatedUser, ResourceGuard } from 'nest-keycloak-connect';
import { Roles, Unprotected } from 'nest-keycloak-connect';
import { MovieService, Movie } from './movie.service';

@Controller("api")
export class MovieController {
  constructor(private readonly appService: MovieService) { }

  @Get('/info')
  @Unprotected()
  getInfo(): string {
    return `Demo v1.0`;
  }

  @Get('/user')
  @ApiBearerAuth("FAM")
  getWelcomeMessage(@AuthenticatedUser() user: any): string {
    return `Hello ${user.name}`;
  }

  @Get('/movies')
  @ApiBearerAuth("FAM")
  getAllMovies(): Movie[] {
    const movies = this.appService.getAllMovies();
    return movies;
  }

  @Get('/movies/:id')
  @ApiBearerAuth("FAM")
  @ApiParam({ name: 'id', type: 'number', description: 'movie identity' })
  getMovie(@Param("id") id: number): Movie {
    return this.appService.getMovie(id);
  }

  @Delete("/movies/:id")
  @ApiBearerAuth("FAM")
  @ApiParam({ name: 'id', type: 'number', description: 'movie identity' })
  @Roles({ roles: ['admin'] })
  removeMovie(@Param("id") id: number): Movie {
    return this.appService.removeMovie(id);
  }
}
