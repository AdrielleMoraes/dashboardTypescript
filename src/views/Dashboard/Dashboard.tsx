import React from "react";

import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Store from "@material-ui/icons/Store";


// core components
import GridItem from "../../components/Grid/GridItem";
import GridContainer from "../../components/Grid/GridContainer";
import Tasks from "../../components/Tasks/Tasks";
import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import CardIcon from "../../components/Card/CardIcon";
import CardBody from "../../components/Card/CardBody";

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


import dashboardStyle from "../../assets/jss/material-dashboard-react/views/dashboardStyle";
import { weekdays } from "moment";



type Country = {
  country_name: string,
  total_holidays: number,
  uuid: string,
  "iso-3166": string
}

type Holiday = {
  name: string,
  description: string,
  country: {
    id: number,
    name: string
  },
  states: string,
  date:{
    iso: string,
    datetime:{
      year: number,
      month: number,
      day: number
    },
    type: Array<string>
  }
}


type APIHolidaysResponse = {
  meta: {
    code: number
  }
  response: {
    holidays: Array<Holiday>,
  }
}

type APICountriesResponse = {
  meta: {
    code: number
  }
  response: {
    url: string,
    countries: Array<Country>,
  }
}

interface Props {
  classes: any;
}

interface State {
  value: number;
  messageSuccess: boolean;
  messageFailed: boolean;
  api_key: string,


  year: number;
  month: number;
  day: number;
  country: string;

  //calendar
  selectedDay: Date;

  apiCountriesResponse?: APICountriesResponse;

  apiHolidaysResponse?: APIHolidaysResponse;
}

class Dashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let d = new Date();
    this.state = {
      value: 0,
      messageSuccess: true,
      messageFailed: true,

      api_key: "b518661602ef8ef45db2cb0f88e1013c7b303b56",
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),

      country: "BR",
      selectedDay: new Date()
    };
    this.handleChange = this.handleChange.bind(this);
    this.fetchHolidays = this.fetchHolidays.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleMonthChange = this.handleMonthChange.bind(this);
  }

  componentDidMount(){

    this.fetchCountries();

    this.fetchHolidays(this.state.country,this.state.year);

  }

  fetchCountries = ()=>{
    const holidays_url = `https://calendarific.com/api/v2/countries?&api_key=${this.state.api_key}`;
    fetch(holidays_url)
    .then((response) => response.json())
    .then((response: APICountriesResponse) => this.setState({ apiCountriesResponse: response }));
  }

  fetchHolidays = (country: string, year: number) =>{

    const holidays_url = `https://calendarific.com/api/v2/holidays?&api_key=${this.state.api_key}&country=${country}&year=${year}`;

    fetch(holidays_url)
    .then((response) => response.json())
    .then((response: APIHolidaysResponse) => {
      return this.setState({apiHolidaysResponse: response });
    });
  }

  handleChange = (event:  React.ChangeEvent<{ value: unknown }>) => {
    this.fetchHolidays(event.target.value as string, this.state.year);
    this.setState({ country: event.target.value as string });
    
  };

  handleDayClick(date: Date) {
    if( date.getFullYear() !== this.state.year){
    this.fetchHolidays(this.state.country, date.getFullYear());
    }

    this.setState({ selectedDay: date, month: date.getMonth()+1, day: date.getDate(),  });
  }

  handleMonthChange(date: Date) {
    if( date.getFullYear() !== this.state.year){

      this.fetchHolidays(this.state.country, date.getFullYear())
    }

    this.setState({month: date.getMonth()+1, year: date.getFullYear(), selectedDay: date})
  }

  weekDaysDistribution = ()=>{
    let ex_weekDays = [[0,1,2,3,4,5,6]]

    if(this.state.apiHolidaysResponse?.response.holidays){
      let holidays = this.state.apiHolidaysResponse?.response.holidays
      let weekDistribution = holidays.map(item =>{
        let day = new Date(item.date.datetime.year, item.date.datetime.month, item.date.datetime.day);
        return day.getDay();
      })
      ex_weekDays[0] = [0,1,2,3,4,5,6].map(element => weekDistribution.filter(item => item === element).length);
    }
    return ex_weekDays;
  }

  updateTasks = (holidays: Array<Holiday>)=>{
    let tasks = holidays.map(item=> `${item.date.datetime.day}/${item.date.datetime.month}: ${item.name}`)
    return tasks.length>0?tasks:["There are no Holidays this month"]
  }


  render() {
    const { classes } = this.props;

    let ex_country = this.state.apiCountriesResponse?.response.countries.find( item => item["iso-3166"] === this.state.country);

    let ex_dayHolidays = this.state.apiHolidaysResponse?.response.holidays.filter(item => item.date.datetime.day === this.state.day && item.date.datetime.month===this.state.month);

    let month_holidays = this.state.apiHolidaysResponse?.response.holidays.filter(item => item.date.datetime.month === this.state.month);

    let tasks = ["There are no Holidays this month"]

    if(month_holidays){
      tasks = this.updateTasks(month_holidays);
    }



    let distributionYear = {
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        series: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(day => this.state.apiHolidaysResponse?.response.holidays.filter(item => item.date.datetime.month === day).length)]
      }
    }

    let distributionWeek = {
      data: {
        labels: ['S','M', 'T', 'W', 'T', 'F', 'S'],
        series: this.weekDaysDistribution()
      }
    }

    return (
      <div>
        <GridContainer>
        <GridItem xs={12} md={4}>
            <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Country</InputLabel>
            <Select
              id="demo-simple-select"
              value={this.state.country}
              onChange={this.handleChange}
            >
            {this.state.apiCountriesResponse?.response.countries.map((country, index) =>
              <MenuItem key={index} value={country["iso-3166"]}>{country.country_name}</MenuItem>
            )}
            </Select>
          </FormControl>
          </GridItem>
        </GridContainer>
        <GridContainer>


          <GridItem xs={12} md={4}>
            <DayPicker 
            selectedDays={this.state.selectedDay}
            onDayClick={this.handleDayClick}
            onMonthChange = {this.handleMonthChange}
            />
              </GridItem>
          <GridItem xs={12} md={4}>
              <Card>
                <CardHeader color="danger" stats={true} icon={true}>
                  <CardIcon color="danger">
                    <Icon>info_outline</Icon>
                  </CardIcon>
                  <p className={classes.cardCategory}>Holidays this month</p>
                  <h3 className={classes.cardTitle}>{month_holidays?.length}</h3>
                </CardHeader>
              </Card>
            </GridItem>
            <GridItem xs={12} md={4}>
            <Card>
              <CardHeader color="success" stats={true} icon={true}>
                <CardIcon color="success">
                  <Store />
                </CardIcon>
                <p className={classes.cardCategory}>Country</p>
                <h3 className={classes.cardTitle}>{ex_country?.country_name}</h3>
              </CardHeader>
            </Card>
          </GridItem>
        </GridContainer>

        <GridContainer>
        <GridItem xs={12} md={4}>
          </GridItem>
          <GridItem xs={12} md={4}>
            <Card>
              <CardHeader color="info" stats={true} icon={true}>
                <CardIcon color="info">
                  <Icon>info_outline</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Total Number of Holidays</p>
                <h3 className={classes.cardTitle}>
                  {ex_country?.total_holidays}
                </h3>
              </CardHeader>
            </Card>
          </GridItem>
          <GridItem xs={12} md={4}>
            <Card>
              <CardHeader color="primary" stats={true} icon={true}>
                <CardIcon color="primary">
                  <Icon>info_outline</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Holidays on this day</p>
                <h3 className={classes.cardTitle}>{ex_dayHolidays?.length}</h3>
              </CardHeader>
            </Card>
          </GridItem>
        </GridContainer>


        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <Card chart={true}>
              <CardHeader color="warning">
                <ChartistGraph
                  className="ct-chart"
                  data={distributionYear.data}
                  type="Bar"
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Holidays During the year</h4>
                <p className={classes.cardCategory}>
                  Distribution of the holidays along {2020}
                </p>
              </CardBody>

            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            <Card chart={true}>
              <CardHeader color="danger">
                <ChartistGraph
                  className="ct-chart"
                  data={distributionWeek.data}
                  type="Bar"
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>Holidays Distribution for weekdays</h4>
                <p className={classes.cardCategory}>
                  Check how holidays were distributed among week days
                </p>
              </CardBody>

            </Card>
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem  xs={12}>
          <Card>
              <CardHeader color="primary">
                <div className={classes.messages}>
                  <h4 className={classes.cardTitleWhite}>Holidays List</h4>
                </div>
              </CardHeader>
              <CardBody>
                    <Tasks
                      // add holidays description here
                      tasks={tasks}
                      tasksIndexes = {Array.from(Array(tasks.length).keys())}
                    />
              </CardBody>

            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

export default withStyles(dashboardStyle)(Dashboard);
