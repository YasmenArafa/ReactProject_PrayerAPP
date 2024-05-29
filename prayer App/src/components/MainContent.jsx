import Grid from '@mui/material/Unstable_Grid2';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Prayer from './Prayer';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/dist/locale/ar';

moment.locale('ar');

export default function MainContent() {
  const [nextPrayerIndex, setNextPrayerIndex] = useState(2);
  const [timings, setTimings] = useState({
    Fajr: '04:13',
    Dhuhr: '12:52',
    Asr: '16:28',
    Sunset: '19:49',
    Isha: '21:20',
  });
  const [remainingTime, setRemainingTime] = useState('');
  const [selectedCity, setSelectedCity] = useState({
    displayName: 'القاهرة',
    apiName: 'Al Qāhirah',
  });
  const [today, setToday] = useState('');

  const avilableCities = [
    {
      displayName: 'دمياط',
      apiName: 'Dumyāţ',
    },
    {
      displayName: 'القاهرة',
      apiName: 'Al Qāhirah',
    },
    {
      displayName: 'بورسعيد',
      apiName: 'Būr Sa‘īd',
    },
  ];

  const prayersArray = [
    { key: 'Fajr', displayName: 'الفجر' },
    { key: 'Dhuhr', displayName: 'الظهر' },
    { key: 'Asr', displayName: 'العصر' },
    { key: 'Sunset', displayName: 'المغرب' },
    { key: 'Isha', displayName: 'العشاء' },
  ];

  const getTimings = async () => {
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?country=eg&city=${selectedCity.apiName}`
    );
    setTimings(response.data.data.timings);
  };

  useEffect(() => {
    getTimings();
  }, [selectedCity]);

  useEffect(() => {
    const interval = setInterval(() => {
      setupCountdownTimer();
    }, 1000);

    const t = moment();
    setToday(t.format('MMM Do YYYY | h:mm'));

    return () => {
      clearInterval(interval);
    };
  }, [timings]);

  const setupCountdownTimer = () => {
    const momentNow = moment();

    let prayerIndex = 2;

    if (
      momentNow.isAfter(moment(timings.Fajr, 'hh:mm')) &&
      momentNow.isBefore(moment(timings.Dhuhr, 'hh:mm'))
    ) {
      prayerIndex = 1;
    } else if (
      momentNow.isAfter(moment(timings.Dhuhr, 'hh:mm')) &&
      momentNow.isBefore(moment(timings.Asr, 'hh:mm'))
    ) {
      prayerIndex = 2;
    } else if (
      momentNow.isAfter(moment(timings.Asr, 'hh:mm')) &&
      momentNow.isBefore(moment(timings.Sunset, 'hh:mm'))
    ) {
      prayerIndex = 3;
    } else if (
      momentNow.isAfter(moment(timings.Sunset, 'hh:mm')) &&
      momentNow.isBefore(moment(timings.Isha, 'hh:mm'))
    ) {
      prayerIndex = 4;
    } else {
      prayerIndex = 0;
    }

    setNextPrayerIndex(prayerIndex);

    const nextPrayerObject = prayersArray[prayerIndex];
    const nextPrayerTime = timings[nextPrayerObject.key];
    const nextPrayerTimeMoment = moment(nextPrayerTime, 'hh:mm');

    let remainingTime = moment(nextPrayerTime, 'hh:mm').diff(momentNow);

    if (remainingTime < 0) {
      const midnightDiff = moment('23:59:59', 'hh:mm:ss').diff(momentNow);
      const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
        moment('00:00:00', 'hh:mm:ss')
      );

      const totalDiffernce = midnightDiff + fajrToMidnightDiff;

      remainingTime = totalDiffernce;
    }

    const durationRemainingTime = moment.duration(remainingTime);

    setRemainingTime(
      `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
    );
  };

  const handleCityChange = (event) => {
    const cityObject = avilableCities.find((city) => {
      return city.apiName === event.target.value;
    });
    setSelectedCity(cityObject);
  };

  return (
    <div>
      <Grid container spacing={2} justifyContent={'space-around'} alignItems={'center'}>
        <Grid xs={6} sm={3} md={2}>
          <div>
            <h2>{today}</h2>
            <h1>{selectedCity.displayName}</h1>
          </div>
        </Grid>
        <Grid xs={6} sm={3} md={2}>
          <div>
            <h3>متبقى حتى صلاة {prayersArray[nextPrayerIndex].displayName}</h3>
            <h1
              style={{ fontSize: '30px', boxShadow: '2px 4px 4px 1px', padding: '5px' }}
            >
              {remainingTime}
            </h1>
          </div>
        </Grid>
      </Grid>

      <Divider style={{ borderColor: 'white', opacity: '0.2' }} />

      <Stack direction='row' justifyContent={'space-around'} marginTop={'30px'}>
        <Prayer name='الفجر' time={timings.Fajr} image='../images/fajr-prayer.png' />
        <Prayer name='الظهر' time={timings.Dhuhr} image='../images/dhhr-prayer-mosque.png' />
        <Prayer name='العصر' time={timings.Asr} image='../images/asr-prayer-mosque.png' />
        <Prayer name='المغرب' time={timings.Sunset} image='../images/sunset-prayer-mosque.png' />
        <Prayer name='العشاء' time={timings.Isha} image='../images/night-prayer-mosque.png' />
      </Stack>

      <Stack direction='row' justifyContent={'center'}>
        <FormControl style={{ width: '25%', marginTop: '50px' }}>
          <InputLabel style={{ color: 'white', fontSize: '20px' }} id='demo-simple-select-label'>
            المدينه
          </InputLabel>
          <Select
            style={{ color: 'white', fontSize: '20px' }}
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            label='المدينه'
            value={selectedCity.apiName} // Set value to selectedCity.apiName
            onChange={handleCityChange}
          >
            {avilableCities.map((city) => {
              return (
                <MenuItem value={city.apiName} key={city.apiName}>
                  {city.displayName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
    </div>
  );
}
