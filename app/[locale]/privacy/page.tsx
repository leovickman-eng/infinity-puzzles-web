import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'sv' ? 'Integritetspolicy | Infinity Puzzles' : 'Privacy Policy | Infinity Puzzles',
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const sv = locale === 'sv';

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6">
      <div className="max-w-2xl mx-auto">

        <p className="font-display text-sm uppercase tracking-widest text-primary mb-4">
          {sv ? 'Juridiskt' : 'Legal'}
        </p>

        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight">
          {sv ? 'Integritetspolicy' : 'Privacy Policy'}
        </h1>

        <p className="font-body text-sm text-foreground/40 mt-4">
          {sv ? 'Senast uppdaterad: september 2024' : 'Last updated: September 2024'}
        </p>

        <div className="mt-12 space-y-10 font-body text-foreground/70 leading-relaxed text-base">

          {sv ? (
            <>
              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Vem vi är</h2>
                <p>
                  OpenEnd AB (Infinity Puzzles), org.nr 559568-8424, ansvarar för behandlingen av dina personuppgifter. Du kan nå oss på{' '}
                  <a href="mailto:hello@infinity-puzzle.com" className="text-primary underline underline-offset-2">
                    hello@infinity-puzzle.com
                  </a>.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Vilka uppgifter vi samlar in</h2>
                <p>
                  När du lägger en order samlar vi in namn, leveransadress, e-postadress och betalningsinformation.
                  Betalning hanteras av Stripe och vi lagrar aldrig dina kortuppgifter.
                  Om du anmäler dig till vårt nyhetsbrev sparar vi enbart din e-postadress.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Varför vi behandlar uppgifterna</h2>
                <p>
                  Vi behandlar dina uppgifter för att fullgöra din order (rättslig grund: avtal), skicka orderbekräftelser
                  och hantera returer. Om du har samtyckt till nyhetsbrev skickar vi dig ibland nyheter om produkter
                  och erbjudanden — du kan när som helst avregistrera dig via länken i mailet.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Hur länge vi sparar uppgifterna</h2>
                <p>
                  Orderdata sparas i sju år enligt bokföringslagen. Nyhetsbrev-prenumerationer raderas när du avregistrerar dig.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Dina rättigheter</h2>
                <p>
                  Enligt GDPR har du rätt att begära ut, rätta eller radera dina personuppgifter. Du kan också invända mot
                  behandlingen eller begära begränsning. Kontakta oss på{' '}
                  <a href="mailto:hello@infinity-puzzle.com" className="text-primary underline underline-offset-2">
                    hello@infinity-puzzle.com
                  </a>{' '}
                  så hjälper vi dig. Du har även rätt att lämna klagomål till Integritetsskyddsmyndigheten (IMY).
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Cookies</h2>
                <p>
                  Vi använder cookies för analys (Google Analytics) och marknadsföring. Du väljer själv vad du godkänner
                  via vår cookiebanner. Du kan ändra dina val när som helst genom att rensa cookies i din webbläsare.
                </p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Who we are</h2>
                <p>
                  OpenEnd AB (Infinity Puzzles), reg. no. 559568-8424, is responsible for the processing of your personal data. You can reach us at{' '}
                  <a href="mailto:hello@infinity-puzzle.com" className="text-primary underline underline-offset-2">
                    hello@infinity-puzzle.com
                  </a>.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">What data we collect</h2>
                <p>
                  When you place an order we collect your name, delivery address, email address and payment information.
                  Payments are handled by Stripe and we never store your card details.
                  If you subscribe to our newsletter we only store your email address.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Why we process your data</h2>
                <p>
                  We process your data to fulfil your order (legal basis: contract), send order confirmations and
                  handle returns. If you have consented to the newsletter we may occasionally send you news about
                  products and offers — you can unsubscribe at any time via the link in the email.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">How long we keep your data</h2>
                <p>
                  Order data is retained for seven years in accordance with Swedish bookkeeping law. Newsletter
                  subscriptions are deleted when you unsubscribe.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Your rights</h2>
                <p>
                  Under GDPR you have the right to request access to, rectification of, or erasure of your personal
                  data. You may also object to processing or request restriction. Contact us at{' '}
                  <a href="mailto:hello@infinity-puzzle.com" className="text-primary underline underline-offset-2">
                    hello@infinity-puzzle.com
                  </a>{' '}
                  and we will help you. You also have the right to lodge a complaint with the Swedish Authority for
                  Privacy Protection (IMY).
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Cookies</h2>
                <p>
                  We use cookies for analytics (Google Analytics) and marketing. You choose what you consent to
                  via our cookie banner. You can change your preferences at any time by clearing cookies in your browser.
                </p>
              </section>
            </>
          )}

        </div>

        <div className="mt-16 pt-10 border-t border-foreground/10">
          <a
            href={`/${locale}`}
            className="font-body text-sm text-foreground/40 hover:text-foreground transition-colors"
          >
            ← {sv ? 'Tillbaka till startsidan' : 'Back to home'}
          </a>
        </div>

      </div>
    </div>
  );
}
