import { getTranslations, setRequestLocale } from 'next-intl/server';
import styles from './about.module.css';

// Statically generated server component (SSG): no client components,
// no runtime data fetching.
export const dynamic = 'force-static';

const COURSE_URL = 'https://rs.school/courses/reactjs';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('About');

  return (
    <main className={styles.about}>
      <h1 className={styles.title}>{t('title')}</h1>
      <p className={styles.intro}>
        {t.rich('intro', {
          course: (chunks) => (
            <a
              className={styles.link}
              href={COURSE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {chunks}
            </a>
          ),
        })}
      </p>

      <section className={styles.authorCard}>
        <span className={styles.authorLabel}>{t('authorLabel')}</span>
        <h2 className={styles.authorName}>{t('authorName')}</h2>
        <p className={styles.authorRole}>{t('authorRole')}</p>
      </section>
    </main>
  );
}
