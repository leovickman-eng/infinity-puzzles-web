import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!_next|api|sitemap\\.xml|robots\\.txt|.*\\.(?:ico|png|jpg|jpeg|svg|gif|webp|woff2?|ttf|otf|eot|css|js)).*)'],
};
