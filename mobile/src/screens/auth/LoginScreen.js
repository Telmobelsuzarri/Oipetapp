import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { TextInput, Button, Snackbar } from 'react-native-paper';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme/colors';
import { theme } from '../../theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn } = useAuth();

  async function handleLogin() {
    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }

    setLoading(true);
    const result = await signIn(email, password);
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
        <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>OiPet</Text>
          </View>
          <Text style={styles.tagline}>Comida de verdade para seu Pet!</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Bem-vindo de volta!</Text>
          <Text style={styles.subtitle}>Entre para acompanhar a nutrição do seu pet</Text>

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

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
            buttonColor={colors.primary}
          >
            Entrar
          </Button>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity 
            style={styles.createAccount}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.createAccountText}>
              Não tem uma conta? <Text style={styles.createAccountLink}>Criar agora</Text>
            </Text>
          </TouchableOpacity>
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
  logoContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.white,
  },
  tagline: {
    fontSize: 16,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  formContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  input: {
    marginBottom: theme.spacing.md,
    backgroundColor: colors.background,
  },
  button: {
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  buttonContent: {
    paddingVertical: theme.spacing.sm,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.surface,
  },
  dividerText: {
    marginHorizontal: theme.spacing.md,
    color: colors.text.secondary,
    fontSize: 14,
  },
  createAccount: {
    alignItems: 'center',
  },
  createAccountText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  createAccountLink: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  snackbar: {
    backgroundColor: colors.error,
  },
});