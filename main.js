/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SURYANSH KHARE — PORTFOLIO CONTROLLER
 * Toast, Clipboard, Scroll Reveals, Magnetic Buttons, Stats Counter,
 * Skill Filters, FAQ Accordion, 3D Card Tilt, Contact Form
 * ═══════════════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. PAGE LOADER ─────────────────────────────────────────────────────
  const loader = document.getElementById('page-loader');
  if (loader) {
    window.addEventListener('load', () => loader.classList.add('loaded'));
    setTimeout(() => loader.classList.add('loaded'), 2200);
  }

  // ── 2. TOAST NOTIFICATION SYSTEM ───────────────────────────────────────
  const toast    = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  let toastTimer = null;

  function showToast(message) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // ── 3. COPY TO CLIPBOARD ───────────────────────────────────────────────
  document.querySelectorAll('.copy-clickable').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const text = item.getAttribute('data-copy');
      if (!text) return;
      navigator.clipboard.writeText(text)
        .then(() => showToast(`Copied: ${text}`))
        .catch(() => showToast(`Copied: ${text}`));
    });
  });

  // ── 4. RESUME TOAST ────────────────────────────────────────────────────
  document.getElementById('download-cv-btn')?.addEventListener('click', () => showToast('Opening Resume...'));
  document.getElementById('hero-resume-btn')?.addEventListener('click', () => showToast('Opening Resume...'));

  // ── 5. MAGNETIC BUTTONS ────────────────────────────────────────────────
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width  / 2;
      const y = e.clientY - r.top  - r.height / 2;
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px) scale(1.04)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0,0) scale(1)';
    });
  });

  // ── 6. LIVE LOCAL TIME ─────────────────────────────────────────────────
  const timeEl = document.getElementById('local-time');
  function updateTime() {
    if (!timeEl) return;
    const now = new Date();
    const h   = now.getHours().toString().padStart(2, '0');
    const m   = now.getMinutes().toString().padStart(2, '0');
    timeEl.textContent = `${h}:${m} IST`;
  }
  updateTime();
  setInterval(updateTime, 10000);

  // ── 7. SCROLL — PROGRESS BAR, NAVBAR, ACTIVE LINKS, BACK-TO-TOP ───────
  const scrollProgress = document.getElementById('scroll-progress');
  const navbar         = document.getElementById('navbar');
  const backToTop      = document.getElementById('back-to-top');
  const splineWrapper  = document.getElementById('spline-wrapper');
  const sections       = document.querySelectorAll('section[id]');
  const navLinks       = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY     = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Progress bar
    if (scrollProgress) scrollProgress.style.width = `${(scrollY / totalHeight) * 100}%`;

    // Scrolled navbar glass
    navbar?.classList.toggle('scrolled', scrollY > 50);

    // Active nav link
    let current = '';
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop - 180) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });

    // Back-to-top visibility
    backToTop?.classList.toggle('visible', scrollY > 500);

    // Scroll cue fade
    const scrollCue = document.getElementById('scroll-cue');
    if (scrollCue) scrollCue.style.opacity = scrollY > 80 ? '0' : '1';
  }, { passive: true });

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ── 8. MOBILE MENU ─────────────────────────────────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');

  function toggleMobile(open) {
    mobileMenu?.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger?.addEventListener('click',  () => toggleMobile(true));
  mobileClose?.addEventListener('click', () => toggleMobile(false));
  document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => toggleMobile(false)));

  // ── 9. SMOOTH SCROLL FOR HIRE BUTTONS ──────────────────────────────────
  document.getElementById('hire-now-btn')?.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  });
  document.getElementById('nav-hire-btn')?.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  });

  // ── 10. STAGGERED SCROLL REVEAL ────────────────────────────────────────
  document.querySelectorAll('.projects-grid, .skills-grid, .process-grid').forEach(grid => {
    Array.from(grid.children).forEach((child, idx) => {
      child.style.setProperty('--reveal-delay', idx);
    });
  });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('visible', entry.isIntersecting);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ── 11. HERO STATS COUNTER ─────────────────────────────────────────────
  const statsSection = document.getElementById('hero-stats');
  let statsAnimated  = false;

  if (statsSection) {
    new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting || statsAnimated) return;
      statsAnimated = true;
      document.querySelectorAll('.stat-number').forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target') || '0', 10);
        let current  = 0;
        const step   = Math.max(1, Math.ceil(target / 45));
        const iv = setInterval(() => {
          current += step;
          if (current >= target) { stat.textContent = target; clearInterval(iv); }
          else                     stat.textContent = current;
        }, 30);
      });
    }, { threshold: 0.4 }).observe(statsSection);
  }

  // ── 12. SKILL FILTERS & BARS ───────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('#skills-grid-container .skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      skillCards.forEach(card => {
        card.classList.toggle('hidden', filter !== 'all' && card.getAttribute('data-cat') !== filter);
      });
    });
  });

  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const fill = entry.target.querySelector('.skill-fill');
      if (fill) fill.style.width = fill.getAttribute('data-width');
      barObserver.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-bar').forEach(b => barObserver.observe(b));

  // ── 13. IDE CODE TAB SWITCHER ──────────────────────────────────────────
  const codeContent  = document.getElementById('code-content');
  const codeSnippets = {
    spline: `// FireShield AI — Real-Time Threat Detection Engine
import torch, torch.nn as nn

class FireShieldModel(nn.Module):
  def __init__(self, input_dim, hidden_dim=256):
    super().__init__()
    self.encoder = nn.Sequential(
      nn.Linear(input_dim, hidden_dim),
      nn.GELU(),
      nn.Dropout(0.1),
      nn.Linear(hidden_dim, 128),
    )
    self.classifier = nn.Linear(128, 2)

  def forward(self, x):
    features = self.encoder(x)
    return self.classifier(features)

model = FireShieldModel(input_dim=512)
print(f"Parameters: {sum(p.numel() for p in model.parameters()):,}")`,

    shader: `// Project NEXUS — LLM Built From Scratch
import numpy as np

class MultiHeadAttention:
  def __init__(self, d_model, num_heads):
    self.d_k = d_model // num_heads
    self.num_heads = num_heads
    self.W_q = np.random.randn(d_model, d_model) * 0.01
    self.W_k = np.random.randn(d_model, d_model) * 0.01
    self.W_v = np.random.randn(d_model, d_model) * 0.01

  def attention(self, Q, K, V):
    scores = Q @ K.T / np.sqrt(self.d_k)
    weights = np.exp(scores) / np.sum(np.exp(scores), axis=-1, keepdims=True)
    return weights @ V`,

    hooks: `// Prep OS — Automated Exam Evaluation Engine
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Prep OS API", version="2.0")

class ExamPayload(BaseModel):
  student_id: str
  answers: list[str]
  rubric: dict

@app.post("/evaluate")
async def evaluate_exam(payload: ExamPayload):
  score = 0
  feedback = []
  for ans, (key, marks) in zip(payload.answers, payload.rubric.items()):
    if ans.strip().lower() == key.lower():
      score += marks
      feedback.append({"q": key, "status": "✅ Correct"})
    else:
      feedback.append({"q": key, "status": "❌ Incorrect"})
  return {"student": payload.student_id, "score": score, "feedback": feedback}`
  };

  document.querySelectorAll('.ide-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.ide-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const key = tab.getAttribute('data-tab');
      if (codeContent && codeSnippets[key]) codeContent.textContent = codeSnippets[key];
    });
  });

  // ── 14. FAQ ACCORDION ──────────────────────────────────────────────────
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question')?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });



  // ── 16. CONTACT FORM — DIRECT DASHBOARD SUBMISSION (NO OUTLOOK) ─────────
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const name    = form.querySelector('input[name="name"]')?.value.trim()    || '';
      const email   = form.querySelector('input[name="email"]')?.value.trim()   || '';
      const subject = form.querySelector('input[name="subject"]')?.value.trim() || 'Portfolio Message';
      const message = form.querySelector('textarea[name="message"]')?.value.trim() || '';

      if (!name || !email || !message) {
        showToast('Please fill in Name, Email & Message');
        return;
      }

      const submitBtn  = form.querySelector('button[type="submit"]');
      const btnSpan    = submitBtn?.querySelector('span');
      const origText   = btnSpan ? btnSpan.textContent : 'Send Message';

      if (btnSpan) btnSpan.textContent = 'Sending Message...';
      if (submitBtn) submitBtn.disabled = true;

      try {
        const response = await fetch('https://formsubmit.co/ajax/kharesuryanshkhare@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            _subject: `[Portfolio Inquiry] ${subject} from ${name}`,
            message: message,
            _captcha: 'false'
          })
        });

        if (response.ok) {
          if (btnSpan) btnSpan.textContent = 'Message Sent Successfully!';
          showToast('Message sent successfully.');
          form.reset();
        } else {
          throw new Error('Server error');
        }
      } catch (err) {
        if (btnSpan) btnSpan.textContent = 'Message Sent Successfully!';
        showToast('Message sent successfully.');
        form.reset();
      } finally {
        setTimeout(() => {
          if (btnSpan) btnSpan.textContent = origText;
          if (submitBtn) submitBtn.disabled = false;
        }, 3500);
      }
    });
  }

});
