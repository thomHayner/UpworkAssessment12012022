import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, FlatList, TextInput, Button } from 'react-native';
import { DATA } from './DUMMYDATA';

export default function OrderBook({ navigation }) {
  const [symbol, setSymbol] = React.useState("btcusd");
  const [subscriptionSymbol, setSubscriptionSymbol] = React.useState("btcusd")
  const [priceData, setPriceData] = React.useState(DATA.PriceData);
  const [bookData, setBookData] = React.useState(DATA.BookData);

  let ws = React.useRef(new WebSocket(`wss://stream.binance.us:9443/ws`)).current;
  
  React.useEffect(() => {
    ws.onopen = () => {
      console.log('OPEN')
      ws.send(`{"method": "SUBSCRIBE","params":["${symbol.toLowerCase()}@ticker", "${symbol.toLowerCase()}@depth20"],"id": 1}`);
      console.log('SUBSCRIBE MESSAGE SENT.');
    };
    ws.onmessage = (e) => {
      let tempDATA = JSON.parse(e.data);
      if (tempDATA === 'ping') {
        ws.send('pong');
      };
      if (tempDATA.lastUpdateId && tempDATA.lastUpdateId !== bookData.lastUpdateId) {
        setBookData(tempDATA);
      };
      if (tempDATA.c && tempDATA.c !== priceData.c) {
        setPriceData(JSON.parse(e.data));
      };
    };
    ws.onerror = (e) => {
      console.log('ERROR: ' + e.message);
    };
    ws.onclose = (e) => {
      console.log('CLOSED, CLOSE CODE: ' + e.code +',' + ' CLOSE REASON: ' + e.reason);
      console.log(e)
    };
  });

  // TOTALS UP THE BIDS AND ASKS TO DETERMINE THE % OF VOLUME PER EACH PRICE LEVEL
  let bidsTotaler = () => {
    let temp = [];
    if (bookData.bids) {
      bookData.bids.forEach((bid) => temp.push(Number(bid[1])))
      let sumTotalBidsAmount = temp.reduce((a,b)=>a+b);
      return sumTotalBidsAmount
    };
  };
  let BidsTotal = bidsTotaler();

  let asksTotaler = () => {
    let temp = [];
    if (bookData.asks) {
      bookData.asks.forEach((bid) => temp.push(Number(bid[1])))
      let sumTotalAsksAmount = temp.reduce((a,b)=>a+b);
      return sumTotalAsksAmount
    };
  };
  let AsksTotal = asksTotaler();

  // CLICK HANDLER TO CHANGE SYMBOL
  const onSymbolButtonClick = () => {
    ws.send(`{"method": "UNSUBSCRIBE","params":["${subscriptionSymbol.toLowerCase()}@ticker", "${subscriptionSymbol.toLowerCase()}@depth20"],"id": 1}`)
    ws.send(`{"method": "SUBSCRIBE","params":["${symbol.toLowerCase()}@ticker", "${symbol.toLowerCase()}@depth20"],"id": 1}`);
    setSubscriptionSymbol(symbol.toLowerCase());
  };

  // RETURN STATEMENT TO DISPLAY UI
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View style={styles.outerContainer}>
        <View style={styles.titleInputArea}>
          <Text style={styles.title}>Enter Symbol Name</Text>
          <View style={{ flexDirection: 'row '}}>
            <TextInput
              style={styles.input}
              onChangeText={setSymbol}
              value={symbol}
            />
            <Button
              title='View Order Book'
              onPress={onSymbolButtonClick}
            />
          </View>
        </View>
        
        <View style={styles.orderBookArea}>

          <View style={styles.columnHeadersArea}>
            <View style={styles.tableCellStart}>
              <Text>Price</Text>
            </View>
            <View style={styles.headerCellEnd}>
              <Text>Amount</Text>
            </View>
            <View style={styles.headerCellEnd}>
              <Text>Total</Text>
            </View>
          </View>

          <View style={styles.asksBidsAreas}>
            <FlatList
              key={item => item.toString()}
              data={bookData.asks} 
              renderItem={({ item }) => {
                let percentOfTotalAmount = () => ((Number(item[1])/AsksTotal) * 100);
                let itemPercentage = percentOfTotalAmount() + '%';
                let itemLeftValue = (100 - percentOfTotalAmount())  + '%';
                return (
                    <View style={styles.tableRow}>
                      <View style={[StyleSheet.absoluteFillObject], {backgroundColor: 'rgba(255,0,0,0.2)', width: itemPercentage, flexDirection: 'row', direction: 'rtl', left: itemLeftValue}}>
                        <View style={styles.tableCellStart}>
                          <Text>{ Math.round(Number(item[0]) * Number(item[1])).toFixed(5) }</Text>
                        </View>
                        <View style={styles.tableCellStart}>
                          <Text>{ Number(item[1]).toFixed(5) }</Text>
                        </View>
                        <View style={styles.tableCellEnd}>
                          <Text style={styles.tableAskPrice}>{ Number(item[0]).toFixed(5) }</Text>
                        </View>
                      </View>
                    </View>
                )}}
            />
          </View>

          <Text style={styles.lastPriceArea}>{priceData.c}</Text>
          
          <View style={styles.asksBidsAreas}>
            <FlatList
              key={item => item[0] * Math.random()}
              data={bookData.bids}
              renderItem={({ item }) => {
                let percentOfTotalAmount = () => ((Number(item[1])/BidsTotal) * 100);
                let itemPercentage = percentOfTotalAmount() + '%';
                let itemLeftValue = (100 - percentOfTotalAmount())  + '%';

                return (
                    <View style={styles.tableRow}>
                      <View style={[StyleSheet.absoluteFillObject], {backgroundColor: 'rgba(0,128,0,0.2)', width: itemPercentage, flexDirection: 'row', direction: 'rtl', left: itemLeftValue}}>
                        <View style={styles.tableCellStart}>
                          <Text>{ Math.round(Number(item[0]) * Number(item[1])).toFixed(5) }</Text>
                        </View>
                        <View style={styles.tableCellStart}>
                          <Text>{ Number(item[1]).toFixed(5) }</Text>
                        </View>
                        <View style={styles.tableCellEnd}>
                          <Text style={styles.tableBidPrice}>{ Number(item[0]).toFixed(5) }</Text>
                        </View>
                      </View>
                    </View>
                )}}
            />
          </View>
        </View>
      <Button
        title='Go to Tab'
        onPress={() => navigation.navigate('TabScreen')}
      />
      </View>
    </SafeAreaView>
  )
};

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerContainer: {
    flex: 1,
  },
  titleInputArea: {
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  input: {
    height: 30,
    borderWidth: 1,
    padding: 10,
  },
  orderBookArea: { 
    hight: 732,
    width: 300,
    marginTop: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  columnHeadersArea: {
    flexDirection: 'row',
    width: 300,
    marginBottom: 5,
  },
  headerCellEnd: {
    width: 100,
    alignItems: 'end',  // figure out how to align text in ios/mobile, only working in web, probably due to "direction: 'rtl'"
    textAlign: 'right',  // figure out how to align text in ios/mobile, only working in web, probably due to "direction: 'rtl'"
  },
  asksBidsAreas: {
    height: 340, // ((16.5 per row) * (20 rows)) + (10 for margins)
  },
  tableRow: {
    flexDirection: 'row',
    width: 300,
  },
  tableCellStart: {
    width: 100,
    alignItems: 'start',
  },
  tableCellEnd: {
    width: 100,
  },
  tableAskPrice: {
    color: 'red',
  },
  tableBidPrice: {
    color: 'green',
  },
  lastPriceArea: {
    alignSelf: 'start',
    justifyItems: 'start',
    marginTop: 8,
    marginBottom: 8,
  },
});
