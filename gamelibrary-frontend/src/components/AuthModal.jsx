import React, { useState } from 'react';
import { supabase } from '../services/supabase';

export function AuthModal({ isOpen, onClose }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    if (!isOpen) return null;

    async function handleAuth(e) {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                alert('Cadastro realizado! Verifique seu e-mail de confirmação.');
            }
            onClose();
        } catch (err) {
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-[#18181b] border border-neutral-800 rounded-xl p-6 text-white shadow-2xl">
                <h2 className="text-xl font-bold text-amber-500 mb-2">
                    {isLogin ? 'Acessar Biblioteca' : 'Criar Nova Conta'}
                </h2>
                <p className="text-xs text-neutral-400 mb-6">
                    {isLogin ? 'Faça login para salvar seus jogos e progresso.' : 'Cadastre-se para sincronizar seus jogos em qualquer dispositivo.'}
                </p>

                {errorMsg && (
                    <div className="mb-4 p-3 bg-red-950/50 border border-red-800 text-red-300 text-xs rounded-lg">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block text-xs text-neutral-300 mb-1">E-mail</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-neutral-300 mb-1">Senha</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 mt-2 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Processando...' : isLogin ? 'Entrar' : 'Cadastrar'}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        type="button"
                        onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}
                        className="text-xs text-neutral-400 hover:text-amber-400 transition-colors"
                    >
                        {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Fazer login'}
                    </button>
                </div>
            </div>
        </div>
    );
}