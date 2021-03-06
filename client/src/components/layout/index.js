import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Saerch from '../search';
import Keywords from '../keywords'
import Alerts from '../alerts'
import Badge from '@material-ui/core/Badge';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#1C1E24',
    width: '100%',
  },
  tabs: {
      backgroundColor: '#1C1E24',
  },
  tab: {
      color: '#D9D9DA'
  }
}));

export default function FullWidthTabs() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [alertCount, setAlertCount] = useState(3)

  const fetchAlertsCount = React.useCallback(() => {
      fetch('/api/alerts/count/root')
      .then(res => res.json())
      .then(res => setAlertCount(res.count))
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    fetchAlertsCount()
      const get = setInterval(fetchAlertsCount, 60000);

      return () => clearInterval(get)
    
  }, [])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
          className={classes.tabs}
        >
          <Tab className={classes.tab} label="Search" {...a11yProps(0)} />
          <Tab className={classes.tab} label="Keywords" {...a11yProps(1)} />
          <Tab className={classes.tab} icon={
              <Badge badgeContent={alertCount} color="error"/>} 
              label="Alerts" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Saerch></Saerch>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Keywords></Keywords>
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <Alerts setCount={setAlertCount} count={alertCount}></Alerts>
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}
