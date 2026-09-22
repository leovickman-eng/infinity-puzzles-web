import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'sv' ? 'Köpvillkor | Infinity Puzzles' : 'Terms & Conditions | Infinity Puzzles',
  };
}

export default async function TermsPage({
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
          {sv ? 'Köpvillkor' : 'Terms & Conditions'}
        </h1>

        <p className="font-body text-sm text-foreground/40 mt-4">
          {sv ? 'Senast uppdaterad: september 2024' : 'Last updated: September 2024'}
        </p>

        <div className="mt-12 space-y-10 font-body text-foreground/70 leading-relaxed text-base">

          {sv ? (
            <>
              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Säljare</h2>
                <p>
                  OpenEnd AB (Infinity Puzzles), org.nr 559568-8424, Sverige.
                  Kontakt:{' '}
                  <a href="mailto:hello@infinity-puzzle.com" className="text-primary underline underline-offset-2">
                    hello@infinity-puzzle.com
                  </a>
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Priser och betalning</h2>
                <p>
                  Alla priser anges i SEK inklusive moms. Betalning sker säkert via Stripe och vi accepterar
                  de vanligaste kort- och betalningsalternativen.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Leverans</h2>
                <p>
                  Vi skickar med PostNord inom Sverige. Leveranstid är normalt 2–5 arbetsdagar efter att ordern har
                  packats (1–3 arbetsdagar). Du får en spårningslänk via e-post när paketet är skickat.
                  Frakt är kostnadsfri på alla beställningar.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Ångerrätt — 14 dagar</h2>
                <p>
                  Som konsument har du 14 dagars ångerrätt från den dag du tar emot din vara, i enlighet med
                  distansavtalslagen (SFS 2005:59). Du behöver inte ange något skäl.
                </p>
                <p className="mt-3">
                  För att använda din ångerrätt: kontakta oss på{' '}
                  <a href="mailto:hello@infinity-puzzle.com" className="text-primary underline underline-offset-2">
                    hello@infinity-puzzle.com
                  </a>{' '}
                  innan 14-dagarsfristen löper ut och meddela att du ångrar köpet. Skicka sedan tillbaka varan
                  i originalskick (inklusive förpackning) inom 14 dagar från din anmälan.
                </p>
                <p className="mt-3">
                  Returfrakten bekostas av dig som kund. Vi återbetalar köpesumman (exklusive ursprunglig frakt,
                  som är gratis och alltså ingår) inom 14 dagar från att vi tagit emot returen, via samma
                  betalningsmetod som du använde.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Reklamation</h2>
                <p>
                  Är varan felaktig eller skadad vid leverans har du rätt att reklamera enligt konsumentköplagen.
                  Kontakta oss direkt på{' '}
                  <a href="mailto:hello@infinity-puzzle.com" className="text-primary underline underline-offset-2">
                    hello@infinity-puzzle.com
                  </a>{' '}
                  med en bild och en kort beskrivning, så löser vi det.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Tvister</h2>
                <p>
                  Eventuella tvister prövas i första hand av Allmänna reklamationsnämnden (ARN),
                  Box 174, 101 23 Stockholm, <a href="https://www.arn.se" className="text-primary underline underline-offset-2">www.arn.se</a>.
                  Du kan också använda EU:s plattform för tvistlösning på <a href="https://ec.europa.eu/odr" className="text-primary underline underline-offset-2">ec.europa.eu/odr</a>.
                </p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Seller</h2>
                <p>
                  OpenEnd AB (Infinity Puzzles), reg. no. 559568-8424, Sweden.
                  Contact:{' '}
                  <a href="mailto:hello@infinity-puzzle.com" className="text-primary underline underline-offset-2">
                    hello@infinity-puzzle.com
                  </a>
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Prices and payment</h2>
                <p>
                  All prices are in SEK and include Swedish VAT. Payment is processed securely via Stripe and
                  we accept all major cards and payment methods.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Delivery</h2>
                <p>
                  We ship with PostNord within Sweden. Delivery normally takes 2–5 business days after the order
                  has been packed (1–3 business days). You will receive a tracking link by email once your parcel
                  has been dispatched. Shipping is free on all orders.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Right of withdrawal — 14 days</h2>
                <p>
                  As a consumer you have a 14-day right of withdrawal from the day you receive your order,
                  in accordance with the Swedish Distance Contracts Act (SFS 2005:59). You do not need to give a reason.
                </p>
                <p className="mt-3">
                  To exercise your right of withdrawal: contact us at{' '}
                  <a href="mailto:hello@infinity-puzzle.com" className="text-primary underline underline-offset-2">
                    hello@infinity-puzzle.com
                  </a>{' '}
                  before the 14-day period expires to notify us that you are withdrawing from the purchase. Then
                  return the item in its original condition (including packaging) within 14 days of your notification.
                </p>
                <p className="mt-3">
                  Return shipping costs are borne by you as the customer. We will refund the purchase price
                  (excluding the original shipping, which is free and therefore included) within 14 days of
                  receiving the return, via the same payment method you used.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Complaints</h2>
                <p>
                  If the item is defective or damaged on delivery you have the right to make a complaint under
                  Swedish consumer purchase law. Contact us directly at{' '}
                  <a href="mailto:hello@infinity-puzzle.com" className="text-primary underline underline-offset-2">
                    hello@infinity-puzzle.com
                  </a>{' '}
                  with a photo and a brief description and we will make it right.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">Disputes</h2>
                <p>
                  Disputes are primarily handled by the Swedish National Board for Consumer Disputes (ARN),
                  Box 174, SE-101 23 Stockholm, <a href="https://www.arn.se" className="text-primary underline underline-offset-2">www.arn.se</a>.
                  You may also use the EU Online Dispute Resolution platform at{' '}
                  <a href="https://ec.europa.eu/odr" className="text-primary underline underline-offset-2">ec.europa.eu/odr</a>.
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
