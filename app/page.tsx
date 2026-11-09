import Image from "next/image";

import BirthdayCake from "@/components/3d/BirthdayCake";
import BirthdayCats from "@/components/ui/BirthdayCats";
import BirthdayEntrance from "@/components/BirthdayEntrance";
import BirthdayExperience from "@/components/BirthdayExperience";
import { BirthdayMusicProvider, MusicToggle } from "@/components/BirthdayMusic";

export default function Home() {
  return (
    <BirthdayMusicProvider>
    <BirthdayExperience>
    <BirthdayEntrance>
    <main className="birthday-page">
      <div className="birthday-shell">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image src="/icon.svg" alt="Stephanie’s birthday cake logo" width={36} height={36} />
          </div>
          <MusicToggle />
        </header>

        <section aria-labelledby="birthday-title" className="birthday-content">
          <div className="text-center">
            <p className="chapter-label">A beautiful new chapter</p>
            <h1 id="birthday-title" className="birthday-title">
              Happy birthday,
              <span className="block text-sage-dark">Stephanie.</span>
            </h1>
          </div>

          <div className="cake-party">
            <figure className="cake-stage" aria-label="Stephanie’s 20th birthday cake">
              <BirthdayCake />
            </figure>
            <BirthdayCats />
          </div>
        </section>
      </div>
    </main>
    </BirthdayEntrance>
    </BirthdayExperience>
    </BirthdayMusicProvider>
  );
}
