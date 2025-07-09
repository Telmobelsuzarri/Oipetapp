import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { TextInput, Button, Snackbar } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme/colors';
import { theme } from '../../theme';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { signUp } = useAuth();

  async function handleRegister() {
    if (!name || !email || !password || !confirmPassword) {
      setError('Preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    const result = await signUp(name, email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
    }
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>
            Cadastre-se para acompanhar a nutrição do seu pet
          </Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            label="Nome completo"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            outlineColor={colors.primary}
            activeOutlineColor={colors.primary}
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            outlineColor={colors.primary}
            activeOutlineColor={colors.primary}
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label="Senha"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            style={styles.input}
            outlineColor={colors.primary}
            activeOutlineColor={colors.primary}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon 
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />

          <TextInput
            label="Confirmar senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            style={styles.input}
            outlineColor={colors.primary}
            activeOutlineColor={colors.primary}
            left={<TextInput.Icon icon="lock-check" />}
          />

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              Ao criar uma conta, você concorda com nossos{' '}
              <Text style={styles.termsLink}>Termos de Uso</Text> e{' '}
              <Text style={styles.termsLink}>Política de Privacidade</Text>
            </Text>
          </View>

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
            buttonColor={colors.primary}
          >
            Criar Conta
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.goBack()}
            style={styles.loginButton}
            textColor={colors.primary}
          >
            Já tem uma conta? Faça login
          </Button>
        </View>
      </ScrollView>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={3000}
        style={styles.snackbar}
      >
        {error}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  formContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  input: {
    marginBottom: theme.spacing.md,
    backgroundColor: colors.background,
  },
  termsContainer: {
    marginVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  termsText: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  button: {
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  buttonContent: {
    paddingVertical: theme.spacing.sm,
  },
  loginButton: {
    marginTop: theme.spacing.lg,
  },
  snackbar: {
    backgroundColor: colors.error,
  },
});