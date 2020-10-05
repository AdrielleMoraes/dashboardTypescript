import React from 'react';
import classnames from 'classnames';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';

import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';

// core components
import tasksStyle from '../../assets/jss/material-dashboard-react/components/tasksStyle';

interface Props {
  classes: any;
  tasksIndexes: any;
  tasks: any;
  rtlActive?: any;
}

interface State {
  checked: any;
}

class Tasks extends React.Component<Props, State> {

  render() {
    const { classes, tasksIndexes, tasks, rtlActive } = this.props;
    const tableCellClasses = classnames(classes.tableCell, {
      [classes.tableCellRTL]: rtlActive
    });
    return (
      <Table className={classes.table}>
        <TableBody>
          {tasksIndexes.map((value: any) => (
            <TableRow key={value} className={classes.tableRow}>
              <TableCell className={tableCellClasses}>
                {tasks[value]}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default withStyles(tasksStyle)(Tasks);
