import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchBar: {
    backgroundColor: '#eee', padding: 10, borderRadius: 8, marginBottom: 16
  },
  sectionHeader: {
    fontSize: 18, fontWeight: '600', marginTop: 24, marginBottom: 8
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 16,
    opacity: 0.5,
  },
  cafeCard: {
    backgroundColor: '#ddd',
    padding: 16,
    borderRadius: 10,
    marginRight: 12,
    width: 160
  },
  cafeName: {
    fontWeight: '600',
    marginBottom: 4
  },
  collectionCard: {
    backgroundColor: '#ddd',
    padding: 20,
    borderRadius: 10,
    marginVertical: 6
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10
  },
  tab: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#000'
  },
  rankCard: {
    backgroundColor: '#eee',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10
  }
});

export default styles;