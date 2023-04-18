"""empty message

Revision ID: 8754fcfa7f30
Revises: a45b0cb18349
Create Date: 2023-04-17 18:10:04.208997

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8754fcfa7f30'
down_revision = 'a45b0cb18349'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('games', schema=None) as batch_op:
        batch_op.alter_column('color',
               existing_type=sa.FLOAT(),
               type_=sa.String(),
               existing_nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('games', schema=None) as batch_op:
        batch_op.alter_column('color',
               existing_type=sa.String(),
               type_=sa.FLOAT(),
               existing_nullable=True)

    # ### end Alembic commands ###
