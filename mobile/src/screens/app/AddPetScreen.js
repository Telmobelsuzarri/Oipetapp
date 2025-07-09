import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { TextInput, Button, RadioButton, Chip, HelperText } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import { theme } from '../../theme';
import api from '../../services/api';

export default function AddPetScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    species: 'dog',
    breed: '',
    birthDate: new Date(),
    weight: '',
    weightUnit: 'kg',
    activityLevel: 'moderate',
    healthConditions: [],
    allergies: [],
    targetWeight: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newCondition, setNewCondition] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [errors, setErrors] = useState({});

  const speciesOptions = [
    { value: 'dog', label: 'Cachorro', icon: 'dog' },
    { value: 'cat', label: 'Gato', icon: 'cat' },
    { value: 'bird', label: 'Pássaro', icon: 'bird' },
    { value: 'rabbit', label: 'Coelho', icon: 'rabbit' },
    { value: 'other', label: 'Outro', icon: 'paw' }
  ];

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentário', description: 'Pouca ou nenhuma atividade' },
    { value: 'moderate', label: 'Moderado', description: 'Caminhadas regulares' },
    { value: 'active', label: 'Ativo', description: 'Exercícios diários' },
    { value: 'very-active', label: 'Muito Ativo', description: 'Alta intensidade de exercícios' }
  ];

  function validateForm() {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      newErrors.weight = 'Peso deve ser maior que zero';
    }
    
    if (formData.birthDate > new Date()) {
      newErrors.birthDate = 'Data de nascimento não pode ser futura';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await api.post('/pets', {
        ...formData,
        weight: parseFloat(formData.weight),
        targetWeight: formData.targetWeight ? parseFloat(formData.targetWeight) : undefined
      });

      Alert.alert(
        'Sucesso!',
        `${formData.name} foi adicionado com sucesso!`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('PetDetail', { petId: response.data._id })
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar o pet. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  function addHealthCondition() {
    if (newCondition.trim()) {
      setFormData(prev => ({
        ...prev,
        healthConditions: [...prev.healthConditions, newCondition.trim()]
      }));
      setNewCondition('');
    }
  }

  function removeHealthCondition(index) {
    setFormData(prev => ({
      ...prev,
      healthConditions: prev.healthConditions.filter((_, i) => i !== index)
    }));
  }

  function addAllergy() {
    if (newAllergy.trim()) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
      setNewAllergy('');
    }
  }

  function removeAllergy(index) {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }));
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>
          
          <TextInput
            label="Nome do Pet *"
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            mode="outlined"
            style={styles.input}
            outlineColor={colors.primary}
            activeOutlineColor={colors.primary}
            error={!!errors.name}
          />
          {errors.name && <HelperText type="error">{errors.name}</HelperText>}

          <Text style={styles.label}>Espécie *</Text>
          <View style={styles.speciesContainer}>
            {speciesOptions.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.speciesOption,
                  formData.species === option.value && styles.speciesOptionActive
                ]}
                onPress={() => setFormData(prev => ({ ...prev, species: option.value }))}
              >
                <Icon 
                  name={option.icon} 
                  size={32} 
                  color={formData.species === option.value ? colors.text.white : colors.text.secondary}
                />
                <Text style={[
                  styles.speciesLabel,
                  formData.species === option.value && styles.speciesLabelActive
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            label="Raça (opcional)"
            value={formData.breed}
            onChangeText={(text) => setFormData(prev => ({ ...prev, breed: text }))}
            mode="outlined"
            style={styles.input}
            outlineColor={colors.primary}
            activeOutlineColor={colors.primary}
          />

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateLabel}>Data de Nascimento *</Text>
            <View style={styles.dateValue}>
              <Icon name="calendar" size={20} color={colors.primary} />
              <Text style={styles.dateText}>
                {formData.birthDate.toLocaleDateString('pt-BR')}
              </Text>
            </View>
          </TouchableOpacity>
          {errors.birthDate && <HelperText type="error">{errors.birthDate}</HelperText>}

          {showDatePicker && (
            <DateTimePicker
              value={formData.birthDate}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  setFormData(prev => ({ ...prev, birthDate: selectedDate }));
                }
              }}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Peso e Atividade</Text>

          <View style={styles.weightContainer}>
            <TextInput
              label="Peso Atual *"
              value={formData.weight}
              onChangeText={(text) => setFormData(prev => ({ ...prev, weight: text }))}
              mode="outlined"
              keyboardType="decimal-pad"
              style={[styles.input, styles.weightInput]}
              outlineColor={colors.primary}
              activeOutlineColor={colors.primary}
              error={!!errors.weight}
            />
            <View style={styles.weightUnitContainer}>
              <RadioButton.Group
                onValueChange={(value) => setFormData(prev => ({ ...prev, weightUnit: value }))}
                value={formData.weightUnit}
              >
                <View style={styles.radioRow}>
                  <RadioButton value="kg" color={colors.primary} />
                  <Text>kg</Text>
                  <RadioButton value="lb" color={colors.primary} />
                  <Text>lb</Text>
                </View>
              </RadioButton.Group>
            </View>
          </View>
          {errors.weight && <HelperText type="error">{errors.weight}</HelperText>}

          <TextInput
            label="Peso Ideal (opcional)"
            value={formData.targetWeight}
            onChangeText={(text) => setFormData(prev => ({ ...prev, targetWeight: text }))}
            mode="outlined"
            keyboardType="decimal-pad"
            style={styles.input}
            outlineColor={colors.primary}
            activeOutlineColor={colors.primary}
          />

          <Text style={styles.label}>Nível de Atividade *</Text>
          <RadioButton.Group
            onValueChange={(value) => setFormData(prev => ({ ...prev, activityLevel: value }))}
            value={formData.activityLevel}
          >
            {activityLevels.map(level => (
              <TouchableOpacity
                key={level.value}
                style={styles.activityOption}
                onPress={() => setFormData(prev => ({ ...prev, activityLevel: level.value }))}
              >
                <RadioButton value={level.value} color={colors.primary} />
                <View style={styles.activityInfo}>
                  <Text style={styles.activityLabel}>{level.label}</Text>
                  <Text style={styles.activityDescription}>{level.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </RadioButton.Group>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saúde</Text>

          <View style={styles.chipInputContainer}>
            <TextInput
              label="Condições de Saúde"
              value={newCondition}
              onChangeText={setNewCondition}
              mode="outlined"
              style={[styles.input, styles.chipInput]}
              outlineColor={colors.primary}
              activeOutlineColor={colors.primary}
              right={
                <TextInput.Icon
                  icon="plus"
                  onPress={addHealthCondition}
                />
              }
            />
          </View>

          <View style={styles.chipContainer}>
            {formData.healthConditions.map((condition, index) => (
              <Chip
                key={index}
                onClose={() => removeHealthCondition(index)}
                style={styles.chip}
              >
                {condition}
              </Chip>
            ))}
          </View>

          <View style={styles.chipInputContainer}>
            <TextInput
              label="Alergias"
              value={newAllergy}
              onChangeText={setNewAllergy}
              mode="outlined"
              style={[styles.input, styles.chipInput]}
              outlineColor={colors.primary}
              activeOutlineColor={colors.primary}
              right={
                <TextInput.Icon
                  icon="plus"
                  onPress={addAllergy}
                />
              }
            />
          </View>

          <View style={styles.chipContainer}>
            {formData.allergies.map((allergy, index) => (
              <Chip
                key={index}
                onClose={() => removeAllergy(index)}
                style={styles.chip}
              >
                {allergy}
              </Chip>
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
            buttonColor={colors.primary}
          >
            Adicionar Pet
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  input: {
    marginBottom: theme.spacing.sm,
    backgroundColor: colors.background,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  speciesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  speciesOption: {
    flex: 1,
    minWidth: 80,
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: colors.surface,
    backgroundColor: colors.background,
  },
  speciesOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  speciesLabel: {
    fontSize: 12,
    marginTop: theme.spacing.xs,
    color: colors.text.secondary,
  },
  speciesLabelActive: {
    color: colors.text.white,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  dateLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  dateValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  dateText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  weightContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    alignItems: 'flex-end',
  },
  weightInput: {
    flex: 1,
  },
  weightUnitContainer: {
    marginBottom: theme.spacing.sm,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  activityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  activityInfo: {
    flex: 1,
  },
  activityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  activityDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  chipInputContainer: {
    marginBottom: theme.spacing.sm,
  },
  chipInput: {
    marginBottom: 0,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  chip: {
    backgroundColor: colors.primary + '20',
  },
  buttonContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  button: {
    borderRadius: theme.borderRadius.md,
  },
  buttonContent: {
    paddingVertical: theme.spacing.sm,
  },
});