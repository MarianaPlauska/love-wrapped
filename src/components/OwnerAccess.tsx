import { type FormEvent, useState } from 'react';

import { isSupabaseConfigured, supabase } from '../lib/supabase';

type OwnerAccessProps = {
  accessDenied?: boolean;
  accessError?: string;
};

export const OwnerAccess = ({ accessDenied = false, accessError = '' }: OwnerAccessProps) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}${window.location.pathname}?admin=1`,
        shouldCreateUser: false,
      },
    });

    setStatus(error ? 'error' : 'sent');
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="flex h-full flex-col justify-between bg-zinc-950 px-6 py-8 text-white">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-lime-300">Área de edição</p>
          <h1 className="mt-3 font-display text-4xl leading-none">O sistema ainda não está conectado.</h1>
          <p className="mt-4 max-w-[28ch] text-sm leading-6 text-white/65">Crie o projeto no Supabase e conecte as chaves públicas antes de editar o presente pela internet.</p>
        </div>
        <a href={window.location.pathname} className="rounded-xl border border-white/20 px-4 py-3 text-center text-sm font-semibold text-white/80">Voltar ao presente</a>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col justify-between bg-zinc-950 px-6 py-8 text-white">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-lime-300">Área de edição</p>
        <h1 className="mt-3 font-display text-4xl leading-none">Entrar para editar.</h1>
        <p className="mt-4 max-w-[29ch] text-sm leading-6 text-white/65">Apenas o email autorizado recebe o link de acesso. O presente compartilhado permanece em leitura.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm text-white/70">
          Seu email
          <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-white/15 bg-white/8 px-3 py-3 text-white outline-none focus:border-lime-300" />
        </label>
        {status === 'sent' && <p className="text-sm leading-6 text-lime-200">Link de acesso enviado. Abra-o neste mesmo navegador.</p>}
        {status === 'error' && <p className="text-sm leading-6 text-rose-200">Não foi possível enviar o link. Revise a configuração de acesso no Supabase.</p>}
        {accessError && <p role="alert" className="text-sm leading-6 text-amber-200">{accessError}</p>}
        {accessDenied && <p role="alert" className="text-sm leading-6 text-rose-200">Esta conta não tem permissão para editar este presente.</p>}
        <button type="submit" className="w-full rounded-xl bg-lime-300 px-4 py-3 text-sm font-bold text-zinc-950 hover:bg-lime-200">Enviar link de acesso</button>
        <a href={window.location.pathname} className="block text-center text-sm font-semibold text-white/60 hover:text-white">Voltar ao presente</a>
      </form>
    </div>
  );
};