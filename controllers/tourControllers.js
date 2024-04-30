
const fs = require('fs')
const Tour = require('./../models/tourModel')
const { match } = require('assert')
const APIFeatures = require('./../utils/apiFeatures');

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../data/tours-simple.json`));

// exports.checkID = (req, res, next, val) => {
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid Id'
//     })
//   }
//   next();
// }

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Missing Name and Price'
//     })
//   }
//   next()
// }

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};



exports.getAllTours = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};


exports.createTour = async (req, res) => {
  // console.log(tours[0]?.id);
  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);
  // tours.push(newTour)
  // fs.writeFile(`${__dirname}/../data/tours-simple.json`, JSON.stringify(tours), err => {
  //   res.status(201).json({
  //     status: 'success',
  //     data: { tour: newTour }
  //   })
  // })

  try {
    const newTour = await Tour.create(req.body)



    res.status(201).json({
      status: 'success',
      data: { tour: newTour }
    })

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    })
  }

}


exports.deleteTour = async (req, res) => {

  try {

    const tour = await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: 'success',
      data: tour
    })

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    })
  }

  // res.status(204).json({
  //   status: 'success',
  //   data: null


  // })
}


exports.getTours = async (req, res) => {
  // const id = req.params.id * 1;

  // if (id > tours.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID '
  //   })
  // }
  // const tour = tours.find(el => el.id === id);
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour: tour
  //   }
  // })
  try {
    const tour = await Tour.findById(req.params.id)
    res.status(200).json({
      status: 'success',
      result: tour?.length,
      data: {
        tour
      }
    })

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    })
  }
}


exports.updateTour = async (req, res) => {
  // if (req.params.id * 1 > tours.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid Id'
  //   })
  // }


  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //only return updated documents
      runValidators: true
    })

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    })
  }


}

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgPrice: 1 }
      }
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1; // 2021

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numTourStarts: -1 }
      },
      {
        $limit: 12
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};


