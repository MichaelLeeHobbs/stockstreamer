/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import Thing from '../api/thing/thing.model';

Thing.find({}).removeAsync()
  .then(function() {
    Thing.create({
      name: 'FB'
    }, {
      name: 'XOM'
    }, /*{
      name: 'VZ'
    }, {
      name: 'AAPL'
    }, {
      name: 'GOOG'
    }, {
      name: 'AMZN'
    }*/);
  });

