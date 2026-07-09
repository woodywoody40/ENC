import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Theme } from '@astryxdesign/core/theme';
import { LinkProvider } from '@astryxdesign/core/Link';
import { neutralTheme } from '@astryxdesign/theme-neutral/built';

/**
 * AstryxProvider wraps the app with Astryx Theme + LinkProvider.
 *
 * - Theme: provides design tokens (colors, spacing, typography) via CSS custom props.
 * - LinkProvider: routes Astryx <Link> components through React Router.
 */
const AstryxLink = React.forwardRef<
  HTMLAnchorElement,
  { href?: string; children?: React.ReactNode; className?: string }
>(({ href, children, className, ...rest }, ref) => {
  // External links → regular <a>
  if (href?.startsWith('http')) {
    return <a ref={ref} href={href} className={className} {...rest}>{children}</a>;
  }
  // Internal links → React Router <Link>
  return <Link ref={ref} to={href ?? '#'} className={className} {...rest}>{children}</Link>;
});

AstryxLink.displayName = 'AstryxLink';

interface AstryxProviderProps {
  children: React.ReactNode;
}

export const AstryxProvider: React.FC<AstryxProviderProps> = ({ children }) => {
  return (
    <Theme theme={neutralTheme}>
      <LinkProvider component={AstryxLink}>
        {children}
      </LinkProvider>
    </Theme>
  );
};

export default AstryxProvider;
