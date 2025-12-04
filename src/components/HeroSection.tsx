import { motion } from 'framer-motion';

interface HeroSectionProps {
  promptCount: number;
  projectCount: number;
}

export function HeroSection({ promptCount, projectCount }: HeroSectionProps) {
  return (
    <motion.section 
      className="relative py-12 sm:py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <motion.h1 
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Tu Biblioteca de{' '}
          <span className="text-lime-accent">Prompts</span>
        </motion.h1>
        
        <motion.p 
          className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Organiza, gestiona y sincroniza todos tus prompts de IA en un solo lugar.
          Crea proyectos, añade imágenes de referencia y accede desde cualquier dispositivo.
        </motion.p>

        <motion.div 
          className="flex items-center justify-center gap-6 sm:gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-lime-accent">{promptCount}</div>
            <div className="text-sm text-text-muted">Prompts</div>
          </div>
          <div className="w-px h-12 bg-dark-border" />
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-emerald-soft">{projectCount}</div>
            <div className="text-sm text-text-muted">Proyectos</div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

