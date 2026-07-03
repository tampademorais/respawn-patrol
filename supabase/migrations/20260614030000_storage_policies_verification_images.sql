-- ============================================
-- RESPAWN PATROL - Storage Policies for verification-images bucket
-- ============================================
-- Execute este script no SQL Editor do Supabase para configurar
-- as políticas de acesso ao bucket verification-images
-- ============================================

-- Primeiro, garantir que o bucket existe (caso não tenha sido criado manualmente)
INSERT INTO storage.buckets (id, name, public)
VALUES ('verification-images', 'verification-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- POLÍTICAS DE ACESSO (Storage Policies)
-- ============================================

-- 1. Permitir leitura pública de todas as imagens (SELECT)
-- Isso permite que qualquer pessoa veja as imagens sem autenticação
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'verification-images');

-- 2. Permitir upload de imagens para qualquer usuário (INSERT)
-- Como o sistema usa cliente anon, permitimos upload sem autenticação
-- Se quiser restringir apenas a usuários logados, mude para: auth.role() = 'authenticated'
CREATE POLICY "Allow public upload access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'verification-images');

-- 3. Permitir atualização da própria imagem (UPDATE)
-- Permite que o usuário que fez o upload possa atualizar o arquivo
CREATE POLICY "Allow public update access"
ON storage.objects FOR UPDATE
USING (bucket_id = 'verification-images')
WITH CHECK (bucket_id = 'verification-images');

-- 4. Permitir exclusão de imagens (DELETE)
-- Permite que o usuário que fez o upload possa excluir o arquivo
CREATE POLICY "Allow public delete access"
ON storage.objects FOR DELETE
USING (bucket_id = 'verification-images');

-- ============================================
-- POLÍTICAS ALTERNATIVAS (se quiser restringir por usuário)
-- ============================================
-- Descomente as políticas abaixo e comente as de cima se quiser
-- restringir o acesso apenas a usuários autenticados:

-- -- Upload apenas para usuários autenticados
-- CREATE POLICY "Allow authenticated upload"
-- ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'verification-images' AND auth.role() = 'authenticated');

-- -- Atualização apenas pelo dono do arquivo
-- CREATE POLICY "Allow owner update"
-- ON storage.objects FOR UPDATE
-- USING (bucket_id = 'verification-images' AND owner = auth.uid())
-- WITH CHECK (bucket_id = 'verification-images' AND owner = auth.uid());

-- -- Exclusão apenas pelo dono do arquivo
-- CREATE POLICY "Allow owner delete"
-- ON storage.objects FOR DELETE
-- USING (bucket_id = 'verification-images' AND owner = auth.uid());

-- ============================================
-- VERIFICAR SE AS POLÍTICAS FORAM CRIADAS
-- ============================================
-- Execute esta query para verificar:
-- SELECT * FROM storage.policies WHERE bucket_id = 'verification-images';