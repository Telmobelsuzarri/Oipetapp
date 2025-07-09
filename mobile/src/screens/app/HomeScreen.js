import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions
} from 'react-native';
import { Card, Avatar, ProgressBar, FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme/colors';
import { theme } from '../../theme';
import api from '../../services/api';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [todayStats, setTodayStats] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [petsRes, articlesRes] = await Promise.all([
        api.get('/pets'),
        api.get('/news?limit=3')
      ]);

      setPets(petsRes.data);
      setArticles(articlesRes.data.articles);

      if (petsRes.data.length > 0) {
        const statsRes = await api.get(`/feedings/stats/${petsRes.data[0]._id}`);
        setTodayStats(statsRes.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }

  function renderPetCard(pet) {
    return (
      <TouchableOpacity
        key={pet._id}
        onPress={() => navigation.navigate('PetDetail', { petId: pet._id })}
      >
        <Card style={styles.petCard}>
          <View style={styles.petCardContent}>
            <Avatar.Icon 
              size={60} 
              icon="paw" 
              style={{ backgroundColor: colors.pet[pet.species] || colors.primary }}
            />
            <View style={styles.petInfo}>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petDetails}>
                {pet.breed || pet.species} • {pet.weight}{pet.weightUnit}
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color={colors.text.secondary} />
          </View>
        </Card>
      </TouchableOpacity>
    );
  }

  function renderNutritionCard() {
    if (!todayStats) return null;

    const { dailyStats, nutritionalGoals } = todayStats;
    const progress = nutritionalGoals?.dailyCalories 
      ? dailyStats.totalCalories / nutritionalGoals.dailyCalories
      : 0;

    return (
      <Card style={styles.nutritionCard}>
        <Card.Content>
          <View style={styles.nutritionHeader}>
            <Text style={styles.nutritionTitle}>Nutrição Hoje</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Feeding')}>
              <Text style={styles.seeAllText}>Ver tudo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.caloriesContainer}>
            <Text style={styles.caloriesText}>
              {Math.round(dailyStats.totalCalories)} / {nutritionalGoals?.dailyCalories || 0} kcal
            </Text>
            <ProgressBar
              progress={Math.min(progress, 1)}
              color={progress > 1 ? colors.warning : colors.success}
              style={styles.progressBar}
            />
          </View>

          <View style={styles.macrosContainer}>
            <View style={styles.macroItem}>
              <View style={[styles.macroDot, { backgroundColor: colors.nutrition.protein }]} />
              <Text style={styles.macroLabel}>Proteína</Text>
              <Text style={styles.macroValue}>{Math.round(dailyStats.totalProtein)}g</Text>
            </View>
            <View style={styles.macroItem}>
              <View style={[styles.macroDot, { backgroundColor: colors.nutrition.fat }]} />
              <Text style={styles.macroLabel}>Gordura</Text>
              <Text style={styles.macroValue}>{Math.round(dailyStats.totalFat)}g</Text>
            </View>
            <View style={styles.macroItem}>
              <View style={[styles.macroDot, { backgroundColor: colors.nutrition.carbs }]} />
              <Text style={styles.macroLabel}>Carbos</Text>
              <Text style={styles.macroValue}>{Math.round(dailyStats.totalCarbs)}g</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  }

  function renderArticleCard(article) {
    return (
      <TouchableOpacity
        key={article._id}
        onPress={() => navigation.navigate('News', { screen: 'ArticleDetail', params: { slug: article.slug } })}
      >
        <Card style={styles.articleCard}>
          <Card.Content>
            <View style={styles.articleHeader}>
              <View style={[styles.categoryBadge, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.categoryText, { color: colors.primary }]}>
                  {article.category}
                </Text>
              </View>
              <Text style={styles.articleDate}>
                {new Date(article.publishedAt).toLocaleDateString('pt-BR')}
              </Text>
            </View>
            <Text style={styles.articleTitle} numberOfLines={2}>{article.title}</Text>
            <Text style={styles.articleSummary} numberOfLines={2}>{article.summary}</Text>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadData} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}, {user?.name?.split(' ')[0]}!</Text>
          <Text style={styles.subtitle}>Como estão seus pets hoje?</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Meus Pets</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Pets')}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {pets.length > 0 ? (
            pets.slice(0, 2).map(renderPetCard)
          ) : (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <Icon name="paw-off" size={48} color={colors.text.secondary} />
                <Text style={styles.emptyText}>Você ainda não tem pets cadastrados</Text>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => navigation.navigate('AddPet')}
                >
                  <Text style={styles.addButtonText}>Adicionar Pet</Text>
                </TouchableOpacity>
              </Card.Content>
            </Card>
          )}
        </View>

        {pets.length > 0 && (
          <View style={styles.section}>
            {renderNutritionCard()}
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notícias e Dicas</Text>
            <TouchableOpacity onPress={() => navigation.navigate('News')}>
              <Text style={styles.seeAllText}>Ver mais</Text>
            </TouchableOpacity>
          </View>

          {articles.map(renderArticleCard)}
        </View>
      </ScrollView>

      {pets.length > 0 && (
        <FAB
          style={styles.fab}
          icon="food"
          label="Registrar Alimentação"
          onPress={() => navigation.navigate('Feeding')}
          color={colors.text.white}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  petCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.small,
  },
  petCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  petInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  petDetails: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  emptyCard: {
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.small,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  addButtonText: {
    color: colors.text.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  nutritionCard: {
    borderRadius: theme.borderRadius.lg,
    backgroundColor: colors.primary + '10',
    ...theme.shadows.small,
  },
  nutritionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  nutritionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  caloriesContainer: {
    marginBottom: theme.spacing.lg,
  },
  caloriesText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surface,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: theme.spacing.xs,
  },
  macroLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  articleCard: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.small,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  articleDate: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  articleSummary: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    margin: theme.spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: colors.secondary,
  },
});