const express = require('express');
const router = express.Router();
const Loan = require('../models/loan.model');
const Book = require('../models/book.model');
const Borrower = require('../models/borrower.model');
const mongoose = require('mongoose');

router.get('/borrowed-books', async (req, res) => {
  try {
    const result = await Loan.aggregate([
      {
        $lookup: {
          from: 'books',
          localField: 'bookId',
          foreignField: '_id',
          as: 'bookDetails'
        }
      },
      {
        $lookup: {
          from: 'borrowers',
          localField: 'borrowerId',
          foreignField: '_id',
          as: 'borrowerDetails'
        }
      },
      {
        $group: {
          _id: '$borrowerId',
          booksBorrowed: { $push: '$bookDetails' }
        }
      }
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get('/top-borrowed-books', async (req, res) => {
  try {
    const result = await Loan.aggregate([
      {
        $group: {
          _id: '$bookId',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'bookDetails'
        }
      }
    ]);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get('/borrower-history/:id', async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const result = await Loan.aggregate([
      { $match: { borrowerId: id } },
      {
        $lookup: {
          from: 'books',
          localField: 'bookId',
          foreignField: '_id',
          as: 'bookDetails'
        }
      }
    ]);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get('/frequent-borrowers', async (req, res) => {
  try {
    const result = await Loan.aggregate([
      {
        $group: {
          _id: '$borrowerId',
          borrowCount: { $sum: 1 }
        }
      },
      { $match: { borrowCount: { $gt: 5 } } },
      {
        $lookup: {
          from: 'borrowers',
          localField: '_id',
          foreignField: '_id',
          as: 'borrowerDetails'
        }
      }
    ]);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get('/loan-reports', async (req, res) => {
  try {
    const result = await Loan.aggregate([
      {
        $lookup: {
          from: 'books',
          localField: 'bookId',
          foreignField: '_id',
          as: 'bookDetails'
        }
      },
      {
        $lookup: {
          from: 'borrowers',
          localField: 'borrowerId',
          foreignField: '_id',
          as: 'borrowerDetails'
        }
      }
    ]);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
