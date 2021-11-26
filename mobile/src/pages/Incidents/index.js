import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { View, FlatList, Image, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../../services/api';
import logoImg from '../../assets/logo.png';
import styles from './styles';

export default function Incidents() {
  const navigation = useNavigation();
  const [incidents, setIncidents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('mais-antigos');
  const [showFilters, setShowFilters] = useState(false);

  function navigateToDetail(incident) {
    navigation.navigate('Detail', { incident });
  }

  async function loadIncidents() {
    if (loading) {
      return;
    }

    if (total > 0 && incidents.length === total) {
      return;
    }

    setLoading(true);

    const response = await api.get('incidents', {
      params: {
        page
      }
    });

    setIncidents([...incidents, ...response.data]);
    setTotal(response.headers['x-total-count']);
    setPage(page + 1);
    setLoading(false);
  }

  const filterIncidents = {
    'mais-recentes': () => {
      setIncidents(incidents.sort((a, b) => b.id - a.id))
    },
    'mais-antigos': () => {
      setIncidents(incidents.sort((a, b) => a.id - b.id))
    },
    'alfabetica': () => {
      setIncidents(incidents.sort((a, b) => a.title.localeCompare(b.title)))
    },
    'maiores-valores': () => {
      setIncidents(incidents.sort((a, b) => b.value - a.value))
    },
    'menores-valores': () => {
      setIncidents(incidents.sort((a, b) => a.value - b.value))
    }
  }

  function handleFilter(filter) {
    setFilter(filter);
    filterIncidents[filter]();
    setShowFilters(false);
  }

  useEffect(() => {
    loadIncidents();
  }, []);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImg}></Image>
        <Text style={styles.headerText}>
          Total de <Text style={styles.headerTextBold}>{total} casos</Text>
        </Text>
      </View>

      <Text style={styles.title}>Bem vindo!</Text>
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia.</Text>
        <TouchableOpacity 
          style={styles.detailsButton}
          onPress={() => {setShowFilters(!showFilters)}}
        >
          <Feather name="filter" size={18} color="#E02041"></Feather>
        </TouchableOpacity>
      </View>
      {showFilters && (
        <Picker
          selectedValue={filter}
          onValueChange={handleFilter}
          style={styles.picker}
        >
          <Picker.Item value="mais-antigos" label="Mais Antigos" />
          <Picker.Item value="mais-recentes" label="Mais Recentes" />
          <Picker.Item value="alfabetica" label="Ordem Alfabética" />
          <Picker.Item value="maiores-valores" label="Maiores Valores" />
          <Picker.Item value="menores-valores" label="Menores Valores" />
        </Picker>
      )}

      <FlatList 
        style={styles.incidentList}
        data={incidents}
        keyExtractor={incident => String(incident.id)}
        // showsVerticalScrollIndicator={false}
        onEndReached={loadIncidents}
        onEndReachedThreshold={0.2}
        renderItem={({ item: incident }) => (
          <View style={styles.incident}>
            <Text style={styles.incidentProperty}>ONG:</Text>
            <Text style={styles.incidentValue}>{incident.name}</Text>

            <Text style={styles.incidentProperty}>CASO:</Text>
            <Text style={styles.incidentValue}>{incident.title}</Text>

            <Text style={styles.incidentProperty}>VALOR:</Text>
            <Text style={styles.incidentValue}>
              {Intl.NumberFormat('pt-BR', { 
                style: 'currency', 
                currency: 'BRL'}).format(incident.value)}
            </Text>

            <TouchableOpacity 
              style={styles.detailsButton}
              onPress={() => {navigateToDetail(incident)}}
            >
              <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>  
              <Feather name="arrow-right" size={16} color="#E02041"></Feather>
            </TouchableOpacity>
          </View>
        )}
      >
      </FlatList>
    </View>
  );
}