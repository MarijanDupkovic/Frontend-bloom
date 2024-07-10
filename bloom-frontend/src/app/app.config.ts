import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { Interceptor } from './services/auth/interceptor.interceptor';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
              provideHttpClient(
                       withFetch(),
                       withInterceptors([Interceptor])),
                       provideClientHydration(withHttpTransferCacheOptions({includePostRequests: true,

                       }))
              ]
};
