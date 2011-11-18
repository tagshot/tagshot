import sys
import pymongo
import json

def connect():
	connection = pymongo.Connection('localhost', 27017)
	return connection.test

def insert(db, fname):
	"""Bulk insert given json objects as documents"""
	f = open(fname, 'r').read()
	db.photos.insert(eval(f))


if __name__ == "__main__":
	fname = sys.argv[1]
	print fname

	insert(connect(), fname)
